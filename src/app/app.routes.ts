import { Routes } from "@angular/router";
import { redirectToAnchorGuard } from "./core/redirect.guard";
import { SECTIONS } from "./core/sections";
import { HomeComponent } from "./features/home/home";
import { ProjectComponent } from "./features/project/project";

const sectionAliasRoutes: Routes = SECTIONS.map((section) => ({
	path: section.routeAlias,
	component: HomeComponent,
	canActivate: [redirectToAnchorGuard]
}));

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent
	},
	...sectionAliasRoutes,
	{
		path: "project/:id",
		component: ProjectComponent
	},
	{
		path: ":id",
		component: ProjectComponent
	},
	{
		path: "**",
		redirectTo: "",
		pathMatch: "full"
	}
];
