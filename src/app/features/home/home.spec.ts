import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideTranslateTesting, setTestTranslations } from "../../../testing/translate.testing";
import { SECTION_IDS } from "../../core/sections";
import { HomeComponent } from "./home";

const HOME_SECTION_IDS = SECTION_IDS.filter((id) => id !== "contact");

describe("HomeComponent", () => {
	let fixture: ComponentFixture<HomeComponent>;

	const section = (id: string): HTMLElement => fixture.nativeElement.querySelector(`#${id}`);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeComponent],
			providers: [provideTranslateTesting(), provideRouter([])]
		}).compileComponents();

		setTestTranslations({
			header: {
				nav: {
					about: "About",
					projects: "Projects",
					experience: "Experience",
					contact: "Contact"
				}
			},
			contact: { title: "Contact", copyright: "© {{year}} Serhii Deineko" },
			hero: {
				subtitle: "Hello",
				title: "Serhii Deineko",
				subtitleLarge: "Angular Frontend Developer",
				description: {
					part1: "",
					part2: "",
					emphasis1: "",
					connector1: "",
					emphasis2: "",
					connector2: "",
					emphasis3: ""
				},
				cta: { certificate: "Certificate", downloadCv: "Download CV" }
			},
			projects: {
				title: "Projects",
				detail: { stack: "Stack" },
				"cta-button": { website: "View project" },
				items: [
					{
						id: "aisema-ai-grant-advisor",
						title: "AISEMA",
						"small-description": "AI grant advisor"
					}
				]
			},
			experience: { title: "Experience", items: [] },
			uni: { screenshot: "Screenshot", portrait: "Portrait" }
		});

		fixture = TestBed.createComponent(HomeComponent);
		fixture.detectChanges();
	});

	it("renders the hero, projects and experience sections", () => {
		expect(section("hero")).not.toBeNull();
		expect(section("projects")).not.toBeNull();
		expect(section("experience")).not.toBeNull();
	});

	it("labels every section with its translated navigation name", () => {
		expect(section("hero").getAttribute("aria-label")).toBe("About");
		expect(section("projects").getAttribute("aria-label")).toBe("Projects");
		expect(section("experience").getAttribute("aria-label")).toBe("Experience");
	});

	it("owns every section anchor it renders exactly once", () => {
		for (const id of HOME_SECTION_IDS) {
			expect(fixture.nativeElement.querySelectorAll(`#${id}`)).toHaveLength(1);
		}
	});

	it("leaves no stale anchors on the inner section elements", () => {
		const host: HTMLElement = fixture.nativeElement;
		const ids = Array.from(
			host.querySelectorAll<HTMLElement>("section[id]"),
			(element) => element.id
		);

		expect(ids).toEqual(HOME_SECTION_IDS);
	});

	it("leaves the global footer and contact section to the application shell", () => {
		expect(fixture.nativeElement.querySelector(".footer")).toBeNull();
		expect(fixture.nativeElement.querySelector("app-contact")).toBeNull();
	});

	it("exposes a focusable main landmark for the skip link", () => {
		const main = fixture.nativeElement.querySelector("main#main-content");

		expect(main).not.toBeNull();
		expect(main.getAttribute("tabindex")).toBe("-1");
	});

	it("mounts the child components of each section", () => {
		expect(section("hero").querySelector("app-hero")).not.toBeNull();
		expect(section("projects").querySelector("app-projects")).not.toBeNull();
		expect(section("experience").querySelector("app-experience")).not.toBeNull();
	});
});
