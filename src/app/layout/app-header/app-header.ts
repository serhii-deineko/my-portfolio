import { CdkTrapFocus } from "@angular/cdk/a11y";
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	linkedSignal,
	signal,
	viewChild
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ScrollService } from "../../core/scroll";
import { SectionId, SECTIONS } from "../../core/sections";
import { LanguageSwitcherComponent } from "./language-switcher/language-switcher";
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher";

interface NavBackgroundInput {
	scrollPosition: number;
	isContactUnderHeader: boolean;
	hasHeroSection: boolean;
}

@Component({
	selector: "app-header",
	imports: [
		LanguageSwitcherComponent,
		ThemeSwitcherComponent,
		TranslatePipe,
		RouterModule,
		MatIconModule,
		MatButtonModule,
		CdkTrapFocus
	],
	templateUrl: "./app-header.html",
	styleUrl: "./app-header.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"(document:keydown.escape)": "closeMobileMenu()"
	}
})
export class AppHeaderComponent {
	private readonly scrollService = inject(ScrollService);

	private readonly menuTrigger = viewChild<unknown, ElementRef<HTMLButtonElement>>(
		"menuTrigger",
		{
			read: ElementRef
		}
	);

	private readonly heroSectionId: SectionId = "hero";
	private readonly backgroundRevealScroll = 150;
	private readonly backgroundHideScroll = 60;

	protected readonly sections = SECTIONS;

	protected readonly activeSection = this.scrollService.activeSection;
	protected readonly isMobileMenuOpen = signal(false);

	protected readonly isNavBackgroundVisible = linkedSignal<NavBackgroundInput, boolean>({
		source: () => ({
			scrollPosition: this.scrollService.scrollPosition(),
			isContactUnderHeader: this.scrollService.isContactUnderHeader(),
			hasHeroSection: this.scrollService.trackedSections().includes(this.heroSectionId)
		}),
		computation: (source, previous) => this.computeNavBackgroundVisible(source, previous?.value)
	});

	protected toggleMobileMenu() {
		this.isMobileMenuOpen.update((isOpen) => !isOpen);
	}

	protected closeMobileMenu() {
		if (!this.isMobileMenuOpen()) {
			return;
		}

		this.isMobileMenuOpen.set(false);
		this.menuTrigger()?.nativeElement.focus();
	}

	protected scrollToSection(sectionId: string, event?: Event) {
		const path = window.location.pathname;
		const isHomePage = path === "/" || path === "";
		if (!isHomePage) {
			return;
		}

		event?.preventDefault();
		history.replaceState(null, "", `#${sectionId}`);
		this.scrollService.scrollTo(sectionId);
	}

	private computeNavBackgroundVisible(
		source: NavBackgroundInput,
		wasVisible: boolean | undefined
	): boolean {
		if (source.isContactUnderHeader) {
			return false;
		}

		if (!source.hasHeroSection) {
			return true;
		}

		return wasVisible ?
				source.scrollPosition > this.backgroundHideScroll
			:	source.scrollPosition > this.backgroundRevealScroll;
	}
}
