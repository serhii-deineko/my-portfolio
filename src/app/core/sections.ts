export type SectionId = "hero" | "projects" | "experience" | "contact";

export interface SectionDefinition {
	readonly id: SectionId;
	readonly labelKey: string;
	readonly routeAlias: string;
}

export const SECTIONS: readonly SectionDefinition[] = [
	{ id: "hero", labelKey: "header.nav.about", routeAlias: "about" },
	{ id: "projects", labelKey: "header.nav.projects", routeAlias: "project" },
	{ id: "experience", labelKey: "header.nav.experience", routeAlias: "experience" },
	{ id: "contact", labelKey: "header.nav.contact", routeAlias: "contact" }
];

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map((section) => section.id);

export const SECTION_BY_ID = Object.fromEntries(
	SECTIONS.map((section) => [section.id, section])
) as Record<SectionId, SectionDefinition>;
