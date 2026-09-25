import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	injectScrollServiceStub,
	provideScrollServiceStub,
	ScrollServiceStub
} from "../../../testing/scroll.stub";
import { provideTranslateTesting, setTestTranslations } from "../../../testing/translate.testing";
import { ScrollService } from "../../core/scroll";
import { SECTIONS } from "../../core/sections";
import { AppHeaderComponent } from "./app-header";

describe("AppHeaderComponent", () => {
	let fixture: ComponentFixture<AppHeaderComponent>;
	let component: AppHeaderComponent;
	let scrollService: ScrollServiceStub;

	const desktopLinks = (): HTMLAnchorElement[] =>
		Array.from(fixture.nativeElement.querySelectorAll(".header__nav--desktop .header__link"));

	const activeSection = (): string => component["activeSection"]();
	const isMobileMenuOpen = (): boolean => component["isMobileMenuOpen"]();
	const isNavBackgroundVisible = (): boolean => component["isNavBackgroundVisible"]();
	const toggleMobileMenu = (): void => component["toggleMobileMenu"]();
	const closeMobileMenu = (): void => component["closeMobileMenu"]();
	const scrollToSection = (sectionId: string, event?: Event): void =>
		component["scrollToSection"](sectionId, event);

	const createComponent = async () => {
		fixture = TestBed.createComponent(AppHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppHeaderComponent],
			providers: [provideRouter([]), provideTranslateTesting(), provideScrollServiceStub()]
		}).compileComponents();

		setTestTranslations({
			header: {
				home: "Home",
				nav: {
					main: "Main navigation",
					about: "About",
					projects: "Projects",
					experience: "Experience",
					contact: "Contact"
				}
			},
			uni: { "change-language": "Change language", "toggle-theme": "Toggle theme" }
		});

		scrollService = injectScrollServiceStub(TestBed.inject(ScrollService));
	});

	const withHeroSection = () => scrollService.trackedSections.set(["hero"]);

	it("renders the translated navigation labels", async () => {
		await createComponent();

		const labels = desktopLinks().map((link) => link.textContent?.trim());

		expect(labels).toEqual(["About", "Projects", "Experience", "Contact"]);
	});

	it("builds both navigation lists from the section registry", async () => {
		await createComponent();

		const host: HTMLElement = fixture.nativeElement;
		const hrefs = (selector: string): string[] =>
			Array.from(
				host.querySelectorAll<HTMLAnchorElement>(selector),
				(link) => link.getAttribute("href") ?? ""
			);
		const expected = SECTIONS.map((section) => `#${section.id}`);

		expect(hrefs(".header__nav--desktop .header__link")).toEqual(expected);
		expect(hrefs(".header__mobile-link")).toEqual(expected);
	});

	it("closes the mobile menu when a section link is followed", async () => {
		await createComponent();
		toggleMobileMenu();
		fixture.detectChanges();

		const host: HTMLElement = fixture.nativeElement;
		host.querySelector<HTMLAnchorElement>(".header__mobile-link")?.click();

		expect(isMobileMenuOpen()).toBe(false);
	});

	it("highlights the section reported by the scroll service", async () => {
		await createComponent();

		scrollService.activeSection.set("projects");
		fixture.detectChanges();

		expect(activeSection()).toBe("projects");
		const active = desktopLinks().filter((link) =>
			link.classList.contains("header__link--active")
		);
		expect(active).toHaveLength(1);
		expect(active[0].getAttribute("aria-current")).toBe("true");
	});

	it("clears the highlight when the scroll service reports no section", async () => {
		await createComponent();

		scrollService.activeSection.set("projects");
		scrollService.activeSection.set("");
		fixture.detectChanges();

		expect(activeSection()).toBe("");
	});

	it("opens and closes the mobile menu", async () => {
		await createComponent();

		toggleMobileMenu();
		expect(isMobileMenuOpen()).toBe(true);

		toggleMobileMenu();
		expect(isMobileMenuOpen()).toBe(false);
	});

	it("ignores a close request when the mobile menu is already closed", async () => {
		await createComponent();

		expect(() => closeMobileMenu()).not.toThrow();
		expect(isMobileMenuOpen()).toBe(false);
	});

	it("closes the mobile menu on escape", async () => {
		await createComponent();
		toggleMobileMenu();
		fixture.detectChanges();

		closeMobileMenu();

		expect(isMobileMenuOpen()).toBe(false);
	});

	it("scrolls to a section and suppresses the default anchor jump on the home page", async () => {
		await createComponent();
		const event = new MouseEvent("click", { cancelable: true });

		scrollToSection("projects", event);

		expect(scrollService.scrollTo).toHaveBeenCalledWith("projects");
		expect(event.defaultPrevented).toBe(true);
		expect(window.location.hash).toBe("#projects");
	});

	it("shows the navigation background on pages without a hero section", async () => {
		await createComponent();

		expect(isNavBackgroundVisible()).toBe(true);
	});

	it("keeps the navigation background hidden at the top of a page with a hero", async () => {
		withHeroSection();

		await createComponent();

		expect(isNavBackgroundVisible()).toBe(false);
	});

	it("reveals the navigation background once the hero is scrolled past", async () => {
		withHeroSection();
		await createComponent();

		scrollService.scrollPosition.set(200);

		expect(isNavBackgroundVisible()).toBe(true);
	});

	it("hides the navigation background again only below the lower threshold", async () => {
		withHeroSection();
		await createComponent();

		scrollService.scrollPosition.set(200);
		expect(isNavBackgroundVisible()).toBe(true);

		scrollService.scrollPosition.set(100);
		expect(isNavBackgroundVisible()).toBe(true);

		scrollService.scrollPosition.set(10);
		expect(isNavBackgroundVisible()).toBe(false);
	});

	it("hides the navigation background while the contact section sits under the header", async () => {
		withHeroSection();
		await createComponent();
		scrollService.scrollPosition.set(800);
		expect(isNavBackgroundVisible()).toBe(true);

		scrollService.isContactUnderHeader.set(true);

		expect(isNavBackgroundVisible()).toBe(false);
	});
});
