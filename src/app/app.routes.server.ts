import { PrerenderFallback, RenderMode, ServerRoute } from "@angular/ssr";
import en from "../assets/i18n/en.json";
import { SECTIONS } from "./core/sections";
import { ProjectContent } from "./shared/data/projects/projects.model";
import { PROJECTS_DEFINITIONS } from "./shared/data/projects/projects.data";

const prerenderableProjectIds = (en.projects.items as ProjectContent[])
	.map((project) => project.id)
	.filter((id) => id in PROJECTS_DEFINITIONS);

const sectionAliasRoutes: ServerRoute[] = SECTIONS.map((section) => ({
	path: section.routeAlias,
	renderMode: RenderMode.Client
}));

export const serverRoutes: ServerRoute[] = [
	{
		path: "",
		renderMode: RenderMode.Prerender
	},
	{
		path: "project/:id",
		renderMode: RenderMode.Prerender,
		fallback: PrerenderFallback.Client,
		getPrerenderParams: async () => prerenderableProjectIds.map((id) => ({ id }))
	},
	...sectionAliasRoutes,
	{
		path: ":id",
		renderMode: RenderMode.Client
	},
	{
		path: "**",
		renderMode: RenderMode.Client
	}
];
