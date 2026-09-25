import { TestBed } from "@angular/core/testing";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { PROJECTS_DEFINITIONS } from "./projects.data";
import { ProjectsStore } from "./projects.store";

const PROJECT_ID = "aisema-ai-grant-advisor";

describe("ProjectsStore", () => {
	const createStore = (): ProjectsStore => TestBed.inject(ProjectsStore);

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideTranslateTesting()] });
	});

	it("exposes the translated projects as a signal", () => {
		setTestTranslations({
			projects: { items: [{ id: PROJECT_ID, title: "AISEMA" }] }
		});

		expect(createStore().items()).toEqual([{ id: PROJECT_ID, title: "AISEMA" }]);
	});

	it("falls back to an empty list when the translation key is missing", () => {
		setTestTranslations({ uni: { close: "Close" } });

		expect(createStore().items()).toEqual([]);
	});

	it("re-reads the projects after a language change", () => {
		setTestTranslations({ projects: { items: [{ id: PROJECT_ID, title: "AISEMA" }] } });
		const store = createStore();

		setTestTranslations({ projects: { items: [{ id: PROJECT_ID, title: "AISEMA PL" }] } });

		expect(store.items()[0].title).toBe("AISEMA PL");
	});

	it("finds the translated content of a project by id", () => {
		setTestTranslations({
			projects: {
				items: [
					{ id: PROJECT_ID, title: "AISEMA" },
					{ id: "website-chatbot-plugin", title: "Chatbot plugin" }
				]
			}
		});
		const store = createStore();

		expect(store.byId("website-chatbot-plugin")?.title).toBe("Chatbot plugin");
		expect(store.byId("does-not-exist")).toBeUndefined();
	});

	it("resolves the definition that belongs to a project id", () => {
		const store = createStore();

		expect(store.definitionOf(PROJECT_ID)).toBe(PROJECTS_DEFINITIONS[PROJECT_ID]);
		expect(store.definitionOf("does-not-exist")).toBeUndefined();
	});

	it("reports whether a project exists regardless of loaded translations", () => {
		const store = createStore();

		expect(store.hasDefinition(PROJECT_ID)).toBe(true);
		expect(store.hasDefinition("does-not-exist")).toBe(false);
		expect(store.items()).toEqual([]);
	});

	it("builds screenshot paths relative to the site root", () => {
		const store = createStore();

		expect(store.imagePath(PROJECT_ID, 0)).toBe(`projects/${PROJECT_ID}/0.jpg`);
		expect(store.imagePath(PROJECT_ID, 3)).toBe(`projects/${PROJECT_ID}/3.jpg`);
	});
});
