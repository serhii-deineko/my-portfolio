import { SECTION_BY_ID, SECTION_IDS, SECTIONS } from "./sections";

describe("sections registry", () => {
	it("lists the identifiers in registry order", () => {
		expect(SECTION_IDS).toEqual(["hero", "projects", "experience", "contact"]);
	});

	it("keeps every identifier unique", () => {
		expect(new Set(SECTION_IDS).size).toBe(SECTIONS.length);
	});

	it("keeps every route alias unique", () => {
		const aliases = SECTIONS.map((section) => section.routeAlias);

		expect(new Set(aliases).size).toBe(SECTIONS.length);
	});

	it("gives every section a translation key", () => {
		for (const section of SECTIONS) {
			expect(section.labelKey).toMatch(/^header\.nav\./);
		}
	});

	it("indexes every section by its identifier", () => {
		for (const section of SECTIONS) {
			expect(SECTION_BY_ID[section.id]).toBe(section);
		}
	});
});
