import { Service, signal } from "@angular/core";

@Service()
export class PageLoadingService {
	private readonly minimumVisibleMs = 500;

	private readonly loading = signal<boolean>(true);
	private shownAt = Date.now();
	private pendingReveal?: ReturnType<typeof setTimeout>;
	private pendingDependencies = new Set<string>();

	readonly isLoading = this.loading.asReadonly();

	constructor() {
		this.setScrollState(false);
	}

	start(): void {
		clearTimeout(this.pendingReveal);
		this.shownAt = Date.now();
		this.loading.set(true);
		this.setScrollState(false);
	}

	addDependency(name: string): void {
		this.pendingDependencies.add(name);
	}

	resolveDependency(name: string): void {
		this.pendingDependencies.delete(name);
		if (this.pendingDependencies.size === 0) {
			this.checkReady();
		}
	}

	ready(): void {
		this.checkReady();
	}

	private checkReady(): void {
		if (this.pendingDependencies.size > 0) {
			return;
		}

		clearTimeout(this.pendingReveal);

		const remaining = this.minimumVisibleMs - (Date.now() - this.shownAt);

		if (remaining <= 0) {
			this.finishLoading();
			return;
		}

		this.pendingReveal = setTimeout(() => this.finishLoading(), remaining);
	}

	private finishLoading(): void {
		this.loading.set(false);
		this.setScrollState(true);
	}

	private setScrollState(enable: boolean): void {
		if (typeof document !== "undefined" && document.body) {
			document.body.style.overflow = enable ? "" : "hidden";
		}
	}
}
