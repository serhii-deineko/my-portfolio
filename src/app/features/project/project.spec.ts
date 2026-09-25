import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { provideTranslateTesting, setTestTranslations } from "../../../testing/translate.testing";
import { PROJECTS_DEFINITIONS } from "../../shared/data/projects/projects.data";
import { ProjectComponent } from "./project";

const PROJECT_ID = "aisema-ai-grant-advisor";
const OTHER_PROJECT_ID = "website-chatbot-plugin";

describe("ProjectComponent", () => {
	let harness: RouterTestingHarness;

	const openProject = async (projectId: string) => {
		harness = await RouterTestingHarness.create();
		return harness.navigateByUrl(`/project/${projectId}`, ProjectComponent);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [
				provideRouter([
					{ path: "", children: [] },
					{ path: "project", component: ProjectComponent },
					{ path: "project/:id", component: ProjectComponent }
				]),
				provideTranslateTesting()
			]
		});

		setTestTranslations({
			projects: {
				detail: { project: "Project", stack: "Stack" },
				"cta-button": { website: "View project" },
				items: [
					{
						id: PROJECT_ID,
						title: "AISEMA",
						"small-description": "AI grant advisor",
						"key-points": [
							"Delivered the grant matching engine",
							{ title: "Reporting", description: "Built the analytics dashboard" }
						]
					},
					{
						id: OTHER_PROJECT_ID,
						title: "Chatbot plugin",
						"small-description": "Embeddable chatbot"
					}
				]
			},
			uni: {
				close: "Close",
				"enlarge-image": "Enlarge image",
				"watch-demo": "Watch demo",
				screenshot: "Screenshot"
			}
		});
	});

	it("resolves the project matching the route parameter", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["projectId"]()).toBe(PROJECT_ID);
		expect(component["currentProject"]()?.title).toBe("AISEMA");
		expect(component["projectDefinition"]()).toBe(PROJECTS_DEFINITIONS[PROJECT_ID]);
	});

	it("renders the project title and description", async () => {
		await openProject(PROJECT_ID);
		const content: HTMLElement = harness.routeNativeElement!;

		expect(content.querySelector(".detail__title")?.textContent?.trim()).toBe("AISEMA");
		expect(content.querySelector(".detail__description")?.textContent).toContain(
			"AI grant advisor"
		);
	});

	it("numbers the project within the full portfolio", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["projectNumber"]()).toBe("01");
		expect(component["projectTotal"]()).toBe("02");
	});

	it("leaves the numbering empty for an unknown project", async () => {
		const component = await openProject("does-not-exist");

		expect(component["currentProject"]()).toBeUndefined();
		expect(component["projectNumber"]()).toBe("");
		expect(component["projectTotal"]()).toBe("");
	});

	it("normalises plain string key points into described points", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["points"]()).toEqual([
			{ description: "Delivered the grant matching engine" },
			{ title: "Reporting", description: "Built the analytics dashboard" }
		]);
	});

	it("pairs each key point with the matching screenshot", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["cases"]()).toEqual([
			{
				index: "01",
				title: undefined,
				description: "Delivered the grant matching engine",
				screen: { number: 1, src: `projects/${PROJECT_ID}/1.jpg` }
			},
			{
				index: "02",
				title: "Reporting",
				description: "Built the analytics dashboard",
				screen: { number: 2, src: `projects/${PROJECT_ID}/2.jpg` }
			}
		]);
	});

	it("lists the screenshots left over after the key points", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["screens"]().map((screen) => screen.number)).toEqual([1, 2, 3, 4]);
		expect(component["extraScreens"]()).toEqual([
			{ number: 3, src: `projects/${PROJECT_ID}/3.jpg` },
			{ number: 4, src: `projects/${PROJECT_ID}/4.jpg` }
		]);
	});

	it("offers the other projects for navigation without the current one", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["otherProjects"]()).toEqual([
			{
				id: OTHER_PROJECT_ID,
				title: "Chatbot plugin",
				index: "02",
				tech: PROJECTS_DEFINITIONS[OTHER_PROJECT_ID].tech[0]
			}
		]);
	});

	it("builds the hero and fullscreen urls from the active project id", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["heroImage"]()).toBe(`projects/${PROJECT_ID}/0.jpg`);
		expect(component["selectedImageSrc"]()).toBeNull();

		component["openFullscreen"](3);

		expect(component["selectedImageSrc"]()).toBe(`projects/${PROJECT_ID}/3.jpg`);
	});

	it("pads numbers to two digits", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["padNumber"](7)).toBe("07");
		expect(component["padNumber"](42)).toBe("42");
	});

	it("heads every section with its own count", async () => {
		await openProject(PROJECT_ID);
		const content: HTMLElement = harness.routeNativeElement!;

		const counts = new Map(
			Array.from(content.querySelectorAll<HTMLElement>(".sub-header")).map((heading) => [
				heading.id,
				heading.querySelector(".sub-header__count")?.textContent?.trim()
			])
		);

		expect(counts.get("cases-heading")).toBe("02");
		expect(counts.get("stack-heading")).toBe(
			PROJECTS_DEFINITIONS[PROJECT_ID].tech.length.toString().padStart(2, "0")
		);
		expect(counts.get("nav-heading")).toBe("01");
	});

	it("opens and closes the fullscreen viewer", async () => {
		const component = await openProject(PROJECT_ID);

		component["openFullscreen"](2);
		expect(component["selectedImage"]()).toBe(2);

		component["closeFullscreen"]();
		expect(component["selectedImage"]()).toBeUndefined();
	});

	it("closes the fullscreen viewer on escape only while it is open", async () => {
		const component = await openProject(PROJECT_ID);

		component["onEscape"]();
		expect(component["selectedImage"]()).toBeUndefined();

		component["openFullscreen"](1);
		component["onEscape"]();
		expect(component["selectedImage"]()).toBeUndefined();
	});

	it("closes the viewer only when the backdrop itself is clicked", async () => {
		const component = await openProject(PROJECT_ID);
		const backdrop = document.createElement("div");
		const image = document.createElement("img");
		backdrop.appendChild(image);

		component["openFullscreen"](1);
		component["onBackdropClick"]({
			target: image,
			currentTarget: backdrop
		} as unknown as MouseEvent);
		expect(component["selectedImage"]()).toBe(1);

		component["onBackdropClick"]({
			target: backdrop,
			currentTarget: backdrop
		} as unknown as MouseEvent);
		expect(component["selectedImage"]()).toBeUndefined();
	});

	it("flags a broken hero image so the fallback layout renders", async () => {
		const component = await openProject(PROJECT_ID);

		expect(component["heroImageBroken"]()).toBe(false);

		component["onHeroImageError"]();

		expect(component["heroImageBroken"]()).toBe(true);
	});

	it("redirects to the home page when the route carries no project id", async () => {
		const navigate = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);

		harness = await RouterTestingHarness.create();
		await harness.navigateByUrl("/project");

		expect(navigate).toHaveBeenCalledWith(["/"]);
	});
});
