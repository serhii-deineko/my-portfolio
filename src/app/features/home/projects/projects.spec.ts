import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { PROJECTS_DEFINITIONS } from "../../../shared/data/projects/projects.data";
import { ProjectsComponent } from "./projects";

const FIRST_PROJECT_ID = "aisema-ai-grant-advisor";
const SECOND_PROJECT_ID = "website-chatbot-plugin";

describe("ProjectsComponent", () => {
	let fixture: ComponentFixture<ProjectsComponent>;

	const host = (): HTMLElement => fixture.nativeElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProjectsComponent],
			providers: [provideTranslateTesting(), provideRouter([])]
		}).compileComponents();

		setTestTranslations({
			projects: {
				title: "Projects",
				detail: { stack: "Stack" },
				"cta-button": { website: "View project" },
				items: [
					{
						id: FIRST_PROJECT_ID,
						title: "AISEMA",
						"small-description": "<p>AI grant advisor</p>"
					},
					{
						id: SECOND_PROJECT_ID,
						title: "Chatbot plugin",
						"small-description": "<p>Embeddable chatbot</p>"
					}
				]
			},
			uni: { screenshot: "Screenshot" }
		});

		fixture = TestBed.createComponent(ProjectsComponent);
		fixture.detectChanges();
	});

	it("renders one card per translated project", () => {
		const cards = host().querySelectorAll(".project__card");

		expect(cards).toHaveLength(2);
	});

	it("alternates the reversed modifier across cards", () => {
		const cards = Array.from(host().querySelectorAll<HTMLElement>(".project__card"));

		expect(cards[0].classList.contains("project__card--reversed")).toBe(false);
		expect(cards[1].classList.contains("project__card--reversed")).toBe(true);
	});

	it("points each card image at the project screenshot folder", () => {
		const image = host().querySelector<HTMLImageElement>(".project__image-img");

		expect(image?.getAttribute("src")).toBe(`projects/${FIRST_PROJECT_ID}/0.jpg`);
		expect(image?.getAttribute("alt")).toBe("Screenshot: AISEMA");
	});

	it("links each card to its project detail page", () => {
		const link = host().querySelector<HTMLAnchorElement>(".project__link .cta-button");

		expect(link?.getAttribute("href")).toBe(`/project/${FIRST_PROJECT_ID}`);
	});

	it("caps the rendered tech stack at seven entries", () => {
		const firstCard = host().querySelector(".project__card");
		const techItems = firstCard?.querySelectorAll(".project__tech-item");

		expect(PROJECTS_DEFINITIONS[FIRST_PROJECT_ID].tech.length).toBeGreaterThan(7);
		expect(techItems).toHaveLength(7);
	});

	it("renders the tech stack that belongs to each project", () => {
		const cards = Array.from(host().querySelectorAll(".project__card"));
		const techOf = (card: Element) =>
			Array.from(card.querySelectorAll(".project__tech-item")).map((item) =>
				item.textContent?.trim()
			);

		expect(techOf(cards[0])).toEqual(PROJECTS_DEFINITIONS[FIRST_PROJECT_ID].tech.slice(0, 7));
		expect(techOf(cards[1])).toEqual(PROJECTS_DEFINITIONS[SECOND_PROJECT_ID].tech);
	});

	it("heads the section with the translated title and the project count", () => {
		const title = host().querySelector<HTMLElement>(".sub-header");
		const count = host().querySelector<HTMLElement>(".sub-header__count");

		expect(title?.textContent).toContain("Projects");
		expect(title?.getAttribute("id")).toBe("project-title");
		expect(count?.textContent?.trim()).toBe("02");
	});
});
