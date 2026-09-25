import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideTranslateTesting, setTestTranslations } from "../../../testing/translate.testing";
import { CONTACT_CHANNELS } from "../layout.constants";
import { AppContactComponent } from "./app-contact";

describe("AppContactComponent", () => {
	let fixture: ComponentFixture<AppContactComponent>;

	const links = (): HTMLAnchorElement[] =>
		Array.from(fixture.nativeElement.querySelectorAll(".contact__link"));

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppContactComponent],
			providers: [provideTranslateTesting()]
		}).compileComponents();

		setTestTranslations({
			contact: { title: "Contact", copyright: "© {{year}} Serhii Deineko" }
		});

		fixture = TestBed.createComponent(AppContactComponent);
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	});

	it("renders every contact channel", () => {
		expect(links()).toHaveLength(CONTACT_CHANNELS.length);
	});

	it("renders the email channel as a mailto link that stays in the tab", () => {
		const email = links().find((link) => link.getAttribute("href")?.startsWith("mailto:"));

		expect(email?.getAttribute("href")).toBe("mailto:serhii.deineko@gmail.com");
		expect(email?.getAttribute("target")).toBeNull();
	});

	it("opens external channels in a new tab with a safe rel", () => {
		const external = links().filter((link) => link.getAttribute("target") === "_blank");

		expect(external).toHaveLength(4);
		external.forEach((link) => expect(link.getAttribute("rel")).toBe("noopener noreferrer"));
	});

	it("labels every channel for assistive technology", () => {
		links().forEach((link) => expect(link.getAttribute("aria-label")).toBeTruthy());
	});

	it("interpolates the current year into the copyright line", () => {
		const copyright = fixture.nativeElement.querySelector(".contact__copyright");

		expect(copyright.textContent).toContain(String(new Date().getFullYear()));
	});

	it("names the section by its heading and leaves the anchor id to the page wrapper", () => {
		const section = fixture.nativeElement.querySelector("section.contact");

		expect(section.getAttribute("aria-labelledby")).toBe("contact-title");
		expect(section.getAttribute("id")).toBeNull();
		expect(fixture.nativeElement.querySelector("#contact-title").textContent).toContain(
			"Contact"
		);
	});

	it("does not render the floating footer", () => {
		expect(fixture.nativeElement.querySelector(".footer")).toBeNull();
	});
});
