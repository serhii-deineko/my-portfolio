import { signal } from "@angular/core";
import { ScrollService } from "../app/core/scroll";

export class ScrollServiceStub {
	readonly activeSection = signal("");
	readonly scrollPosition = signal(0);
	readonly isContactVisible = signal(false);
	readonly isContactUnderHeader = signal(false);
	readonly trackedSections = signal<readonly string[]>([]);

	readonly init = vi.fn();
	readonly updateSections = vi.fn();
	readonly scrollTo = vi.fn();
	readonly clearActiveSection = vi.fn(() => this.activeSection.set(""));

	hasSections(): boolean {
		return this.trackedSections().length > 0;
	}
}

export function provideScrollServiceStub() {
	return { provide: ScrollService, useClass: ScrollServiceStub };
}

export function injectScrollServiceStub(scrollService: ScrollService): ScrollServiceStub {
	return scrollService as unknown as ScrollServiceStub;
}
