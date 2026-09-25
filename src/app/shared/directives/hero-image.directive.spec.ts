import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PageLoadingService } from "../../core/page-loading";
import { HeroImageDirective } from "./hero-image.directive";

@Component({
	imports: [HeroImageDirective],
	template: `
		<img [src]="source" alt="" appHeroImage />
	`
})
class HostComponent {
	source = "/home/hero.png";
}

describe("HeroImageDirective", () => {
	let fixture: ComponentFixture<HostComponent>;
	let resolveDependency: ReturnType<typeof vi.spyOn>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		resolveDependency = vi.spyOn(TestBed.inject(PageLoadingService), "resolveDependency");
		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it("reveals the page once the image finishes loading", () => {
		const image = fixture.debugElement.query(By.directive(HeroImageDirective));

		image.triggerEventHandler("load", new Event("load"));

		expect(resolveDependency).toHaveBeenCalledWith("hero-image");
	});

	it("reveals the page even when the image fails to load", () => {
		const image = fixture.debugElement.query(By.directive(HeroImageDirective));

		image.triggerEventHandler("error", new Event("error"));

		expect(resolveDependency).toHaveBeenCalledWith("hero-image");
	});

	it("stays idempotent across repeated reveals", () => {
		const directive = fixture.debugElement
			.query(By.directive(HeroImageDirective))
			.injector.get(HeroImageDirective);

		directive["reveal"]();
		directive["reveal"]();

		expect(resolveDependency).toHaveBeenCalledTimes(2);
	});
});
