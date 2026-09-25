import { isPlatformBrowser } from "@angular/common";
import { DestroyRef, DOCUMENT, inject, NgZone, PLATFORM_ID, Service, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

interface SectionBounds {
	id: string;
	top: number;
	bottom: number;
}

@Service()
export class ScrollService {
	private readonly zone = inject(NgZone);
	private readonly destroyRef = inject(DestroyRef);
	private readonly document = inject(DOCUMENT);
	private readonly router = inject(Router);
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly activeSectionOffset = 100;
	private readonly firstSectionScrollThreshold = 200;
	private readonly clearSectionScrollThreshold = 50;
	private readonly contactSectionId = "contact";
	private readonly contactHeaderBandPercent = 30;

	readonly activeSection = signal("");
	readonly scrollPosition = signal(0);
	readonly isContactVisible = signal(false);
	readonly isContactUnderHeader = signal(false);
	readonly trackedSections = signal<readonly string[]>([]);

	private registeredSectionIds: string[] = [];
	private sectionElements: HTMLElement[] = [];
	private sectionBounds: SectionBounds[] = [];
	private scrollProgressBar: HTMLElement | null = null;
	private scrollableHeight = 0;
	private renderedProgress = -1;
	private boundsStale = true;
	private frameRequested = false;
	private listenersAttached = false;
	private documentObserver?: ResizeObserver;
	private contactVisibilityObserver?: IntersectionObserver;
	private contactHeaderObserver?: IntersectionObserver;

	constructor() {
		this.destroyRef.onDestroy(() => {
			this.detachListeners();
			this.disconnectContactObservers();
		});

		if (this.isBrowser) {
			this.router.events
				.pipe(
					filter((event) => event instanceof NavigationEnd),
					takeUntilDestroyed()
				)
				.subscribe(() => this.zone.runOutsideAngular(() => this.refreshAfterNavigation()));
		}
	}

	init(sectionIds: readonly string[], scrollProgressElementClass: string) {
		if (!this.isBrowser) {
			return;
		}

		this.registeredSectionIds = [...sectionIds];
		this.collectSections(sectionIds);
		this.scrollProgressBar = this.document.querySelector<HTMLElement>(
			`.${scrollProgressElementClass}`
		);
		this.boundsStale = true;
		this.observeContactSection();
		this.attachListeners();
		this.processScroll();
	}

	scrollTo(sectionId: string) {
		if (!this.isBrowser) {
			return;
		}

		this.document.getElementById(sectionId)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}

	updateSections(sectionIds: readonly string[]) {
		if (!this.isBrowser) {
			return;
		}

		this.collectSections(sectionIds);
		this.boundsStale = true;
		this.observeContactSection();
		this.processScroll();
	}

	hasSections(): boolean {
		return this.trackedSections().length > 0;
	}

	clearActiveSection() {
		this.activeSection.set("");
	}

	private collectSections(sectionIds: readonly string[]) {
		this.sectionElements = this.queryElements(sectionIds);
		this.trackedSections.set(this.sectionElements.map((element) => element.id));
	}

	private refreshAfterNavigation() {
		if (typeof requestAnimationFrame === "undefined") {
			this.updateSections(this.registeredSectionIds);
			return;
		}

		requestAnimationFrame(() => this.updateSections(this.registeredSectionIds));
	}

	private attachListeners() {
		if (this.listenersAttached || !this.isBrowser) {
			return;
		}
		this.listenersAttached = true;

		this.zone.runOutsideAngular(() => {
			window.addEventListener("scroll", this.handleScroll, { passive: true });
			window.addEventListener("resize", this.invalidateBounds, { passive: true });
			window.addEventListener("hashchange", this.handleHashChange);
			window.addEventListener("popstate", this.handlePopState);

			if (typeof ResizeObserver !== "undefined") {
				this.documentObserver = new ResizeObserver(this.invalidateBounds);
				this.documentObserver.observe(this.document.documentElement);
			}
		});
	}

	private detachListeners() {
		if (!this.isBrowser) {
			return;
		}
		window.removeEventListener("scroll", this.handleScroll);
		window.removeEventListener("resize", this.invalidateBounds);
		window.removeEventListener("hashchange", this.handleHashChange);
		window.removeEventListener("popstate", this.handlePopState);
		this.documentObserver?.disconnect();
	}

	private observeContactSection() {
		this.disconnectContactObservers();

		if (typeof IntersectionObserver === "undefined") {
			return;
		}

		const contactSection = this.document.getElementById(this.contactSectionId);
		if (!contactSection) {
			return;
		}

		this.zone.runOutsideAngular(() => {
			this.contactVisibilityObserver = new IntersectionObserver((entries) =>
				this.isContactVisible.set(this.isIntersecting(entries))
			);
			this.contactVisibilityObserver.observe(contactSection);

			this.contactHeaderObserver = new IntersectionObserver(
				(entries) => this.isContactUnderHeader.set(this.isIntersecting(entries)),
				{ rootMargin: `0px 0px -${100 - this.contactHeaderBandPercent}% 0px` }
			);
			this.contactHeaderObserver.observe(contactSection);
		});
	}

	private disconnectContactObservers() {
		this.contactVisibilityObserver?.disconnect();
		this.contactVisibilityObserver = undefined;
		this.contactHeaderObserver?.disconnect();
		this.contactHeaderObserver = undefined;
		this.isContactVisible.set(false);
		this.isContactUnderHeader.set(false);
	}

	private isIntersecting(entries: IntersectionObserverEntry[]): boolean {
		return entries[entries.length - 1]?.isIntersecting ?? false;
	}

	private queryElements(ids: readonly string[]): HTMLElement[] {
		return ids
			.map((id) => this.document.getElementById(id))
			.filter((element): element is HTMLElement => element !== null);
	}

	private readonly invalidateBounds = () => {
		this.boundsStale = true;
	};

	private readonly handleScroll = () => {
		if (this.frameRequested) {
			return;
		}
		if (typeof requestAnimationFrame === "undefined") {
			this.processScroll();
			return;
		}
		this.frameRequested = true;
		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				this.frameRequested = false;
				this.processScroll();
			});
		});
	};

	private readonly handleHashChange = () => {
		const sectionId = window.location.hash.slice(1);
		if (sectionId && this.sectionElements.some((section) => section.id === sectionId)) {
			this.scrollTo(sectionId);
		}
	};

	private readonly handlePopState = () => {
		this.boundsStale = true;
		this.handleScroll();
	};

	private processScroll() {
		if (!this.isBrowser) {
			return;
		}

		const scrollPosition = window.scrollY;

		if (this.boundsStale) {
			this.measureBounds(scrollPosition);
		}

		this.updateScrollProgress(scrollPosition);
		this.updateActiveSection(scrollPosition);
		this.scrollPosition.set(scrollPosition);
	}

	private measureBounds(scrollPosition: number) {
		this.sectionBounds = this.sectionElements.map((element) => {
			const rect = element.getBoundingClientRect();
			return {
				id: element.id,
				top: rect.top + scrollPosition,
				bottom: rect.bottom + scrollPosition
			};
		});

		this.scrollableHeight =
			this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
		this.boundsStale = false;
	}

	private updateScrollProgress(scrollPosition: number) {
		if (!this.scrollProgressBar) {
			return;
		}

		const progress =
			this.scrollableHeight > 0 ?
				Math.max(0, Math.min(1, scrollPosition / this.scrollableHeight))
			:	0;

		if (progress === this.renderedProgress) {
			return;
		}

		this.renderedProgress = progress;
		this.scrollProgressBar.style.transform = `scaleX(${progress})`;
	}

	private updateActiveSection(scrollPosition: number) {
		if (this.sectionBounds.length === 0) {
			this.activeSection.set("");
			return;
		}

		const anchorPosition = scrollPosition + this.activeSectionOffset;
		let activeSectionId =
			this.findSectionAtPosition(anchorPosition) ||
			this.findClosestSectionAbove(anchorPosition);

		if (!activeSectionId && anchorPosition < this.firstSectionScrollThreshold) {
			activeSectionId = this.sectionBounds[0]?.id || "";
		}

		if (anchorPosition < this.clearSectionScrollThreshold && this.activeSection() !== "") {
			activeSectionId = "";
		}

		if (activeSectionId) {
			this.activeSection.set(activeSectionId);
		}
	}

	private findSectionAtPosition(scrollPosition: number): string {
		for (const section of this.sectionBounds) {
			if (scrollPosition >= section.top && scrollPosition < section.bottom) {
				return section.id;
			}
		}
		return "";
	}

	private findClosestSectionAbove(scrollPosition: number): string {
		for (let i = this.sectionBounds.length - 1; i >= 0; i--) {
			if (this.sectionBounds[i].top <= scrollPosition) {
				return this.sectionBounds[i].id;
			}
		}
		return "";
	}
}
