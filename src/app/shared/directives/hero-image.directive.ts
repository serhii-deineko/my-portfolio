import { afterNextRender, Directive, ElementRef, inject } from "@angular/core";
import { PageLoadingService } from "../../core/page-loading";

@Directive({
	selector: "img[appHeroImage]",
	host: {
		"(load)": "reveal()",
		"(error)": "reveal()"
	}
})
export class HeroImageDirective {
	private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef);
	private readonly pageLoading = inject(PageLoadingService);

	private readonly revealFallbackMs = 5000;

	constructor() {
		this.pageLoading.addDependency("hero-image");

		afterNextRender(() => {
			if (this.image.nativeElement.complete) {
				this.reveal();
				return;
			}
			setTimeout(() => this.reveal(), this.revealFallbackMs);
		});
	}

	protected reveal(): void {
		this.pageLoading.resolveDependency("hero-image");
	}
}
