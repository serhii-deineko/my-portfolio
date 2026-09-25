import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from "@angular/core";

@Directive({
	selector: "[appPauseOffscreen]"
})
export class PauseOffscreenDirective {
	private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly destroyRef = inject(DestroyRef);

	constructor() {
		afterNextRender(() => {
			if (typeof IntersectionObserver === "undefined") {
				return;
			}

			const target = this.element.nativeElement;
			const observer = new IntersectionObserver((entries) => {
				target.style.animationPlayState = entries[0].isIntersecting ? "running" : "paused";
			});

			observer.observe(target);
			this.destroyRef.onDestroy(() => observer.disconnect());
		});
	}
}
