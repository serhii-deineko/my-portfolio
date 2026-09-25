import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { PageLoadingService } from "../../../core/page-loading";
import { HeroComponent } from "./hero";

describe("HeroComponent", () => {
	let fixture: ComponentFixture<HeroComponent>;
	let pageLoading: PageLoadingService;

	const heroSection = (): HTMLElement => fixture.nativeElement.querySelector(".hero");
	const heroImage = (): HTMLImageElement => fixture.nativeElement.querySelector(".hero__image");

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeroComponent],
			providers: [provideTranslateTesting(), provideRouter([])]
		}).compileComponents();

		setTestTranslations({
			hero: {
				subtitle: "Hello, I am",
				title: "Serhii Deineko",
				subtitleLarge: "Angular Frontend Developer",
				description: {
					part1: "I build",
					part2: "web apps",
					emphasis1: "fast",
					connector1: "and",
					emphasis2: "accessible",
					connector2: "with",
					emphasis3: "Angular"
				},
				cta: { certificate: "Business certificate", downloadCv: "Download CV" }
			},
			uni: { portrait: "Portrait of Serhii Deineko" }
		});

		pageLoading = TestBed.inject(PageLoadingService);
		fixture = TestBed.createComponent(HeroComponent);
		fixture.detectChanges();
	});

	it("renders the translated headline", () => {
		expect(fixture.nativeElement.querySelector(".hero__title").textContent).toContain(
			"Serhii Deineko"
		);
		expect(fixture.nativeElement.querySelector(".hero__subtitle-large").textContent).toContain(
			"Angular Frontend Developer"
		);
	});

	it("labels the portrait for assistive technology", () => {
		expect(heroImage().getAttribute("alt")).toBe("Portrait of Serhii Deineko");
	});

	it("stays unrevealed while the page is still loading", () => {
		expect(heroSection().classList.contains("hero--revealed")).toBe(false);
		expect(heroImage().classList.contains("hero__image--revealed")).toBe(false);
	});

	it("reveals itself once the page finished loading", () => {
		vi.useFakeTimers();
		pageLoading.resolveDependency("hero-image");
		vi.advanceTimersByTime(1000);
		vi.useRealTimers();
		fixture.detectChanges();

		expect(pageLoading.isLoading()).toBe(false);
		expect(heroSection().classList.contains("hero--revealed")).toBe(true);
		expect(heroImage().classList.contains("hero__image--revealed")).toBe(true);
	});

	it("renders both call to action buttons", () => {
		const buttons = fixture.nativeElement.querySelectorAll(".hero__cta app-cta-button");

		expect(buttons).toHaveLength(2);
	});
});
