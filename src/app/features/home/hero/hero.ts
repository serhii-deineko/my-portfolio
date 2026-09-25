import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { PageLoadingService } from "../../../core/page-loading";
import { CtaButtonComponent } from "../../../shared/ui/cta-button/cta-button";
import { HeroImageDirective } from "../../../shared/directives/hero-image.directive";
import { PauseOffscreenDirective } from "../../../shared/directives/pause-offscreen.directive";

interface MarqueeItem {
	readonly icon: string;
	readonly label: string;
}

@Component({
	selector: "app-hero",
	imports: [
		NgTemplateOutlet,
		CtaButtonComponent,
		TranslatePipe,
		HeroImageDirective,
		PauseOffscreenDirective
	],
	templateUrl: "./hero.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: "./hero.scss"
})
export class HeroComponent {
	protected readonly pageLoading = inject(PageLoadingService);

	protected readonly marqueeItems: readonly MarqueeItem[] = [
		{ icon: "aztec/9.png", label: "ANGULAR DEVELOPER" },
		{ icon: "aztec/2.png", label: "FRONTEND DEVELOPER" },
		{ icon: "aztec/4.png", label: "FULLSTACK DEVELOPER" },
		{ icon: "aztec/3.png", label: "WEB DESIGNER" },
		{ icon: "aztec/7.png", label: "UI / UX DESIGNER" }
	];
}
