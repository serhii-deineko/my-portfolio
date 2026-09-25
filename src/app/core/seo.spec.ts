import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Meta, Title } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { provideTranslateTesting, setTestTranslations } from "../../testing/translate.testing";
import { SeoService } from "./seo";

@Component({ template: "" })
class BlankComponent {}

const BASE_URL = "https://serhii.com.pl";
const PROJECT_ID = "aisema-ai-grant-advisor";

describe("SeoService", () => {
	let meta: Meta;
	let title: Title;

	const navigateTo = async (url: string) => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url);
	};

	const canonicalHref = () =>
		document.querySelector('link[rel="canonical"]')?.getAttribute("href");

	const structuredData = () => {
		const script = document.getElementById("structured-data");
		return script ? (JSON.parse(script.textContent ?? "[]") as Record<string, string>[]) : [];
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideRouter([
					{ path: "", component: BlankComponent },
					{ path: "about", component: BlankComponent },
					{ path: "project/:id", component: BlankComponent },
					{ path: "**", component: BlankComponent }
				]),
				provideTranslateTesting()
			]
		});

		setTestTranslations({
			projects: {
				items: [
					{
						id: PROJECT_ID,
						title: "AISEMA",
						description: "<p>A grant   advisor   powered by AI.</p>"
					}
				]
			}
		});

		meta = TestBed.inject(Meta);
		title = TestBed.inject(Title);
		TestBed.inject(SeoService);
	});

	afterEach(() => {
		document.getElementById("structured-data")?.remove();
		document.querySelector('link[rel="canonical"]')?.remove();
	});

	it("applies indexable home metadata on the root route", async () => {
		await navigateTo("/");

		expect(title.getTitle()).toContain("Serhii Deineko");
		expect(meta.getTag('name="robots"')?.content).toContain("index, follow");
		expect(canonicalHref()).toBe(`${BASE_URL}/`);
		expect(meta.getTag('property="og:type"')?.content).toBe("website");
	});

	it("canonicalises section routes back to the home page", async () => {
		await navigateTo("/about");

		expect(title.getTitle()).toContain("About Serhii Deineko");
		expect(canonicalHref()).toBe(`${BASE_URL}/`);
	});

	it("builds project metadata from the translated content", async () => {
		await navigateTo(`/project/${PROJECT_ID}`);

		expect(title.getTitle()).toBe("AISEMA - Serhii Deineko");
		expect(meta.getTag('property="og:type"')?.content).toBe("article");
		expect(meta.getTag('property="og:image"')?.content).toBe(
			`${BASE_URL}/projects/${PROJECT_ID}/0.jpg`
		);
		expect(canonicalHref()).toBe(`${BASE_URL}/project/${PROJECT_ID}`);
	});

	it("strips markup and collapses whitespace in the project description", async () => {
		await navigateTo(`/project/${PROJECT_ID}`);

		expect(meta.getTag('name="description"')?.content).toBe("A grant advisor powered by AI.");
	});

	it("marks an unknown project as non-indexable", async () => {
		await navigateTo("/project/does-not-exist");

		expect(meta.getTag('name="robots"')?.content).toBe("noindex, follow");
		expect(structuredData()).toEqual([]);
	});

	it("emits person and website structured data for the home page", async () => {
		await navigateTo("/");

		const types = structuredData().map((entry) => entry["@type"]);

		expect(types).toContain("WebSite");
		expect(types).toContain("Person");
		expect(types).toContain("ProfilePage");
	});

	it("emits creative work and breadcrumb structured data for a project", async () => {
		await navigateTo(`/project/${PROJECT_ID}`);

		const types = structuredData().map((entry) => entry["@type"]);

		expect(types).toEqual(["CreativeWork", "BreadcrumbList"]);
	});
});
