import { redirectToAnchorGuard } from "./core/redirect.guard";
import { SECTIONS } from "./core/sections";
import { HomeComponent } from "./features/home/home";
import { routes } from "./app.routes";

describe("application routes", () => {
	const pathOf = (path: string) => routes.findIndex((route) => route.path === path);

	it("exposes a guarded home alias for every section", () => {
		for (const section of SECTIONS) {
			const route = routes.find((candidate) => candidate.path === section.routeAlias);

			expect(route?.component).toBe(HomeComponent);
			expect(route?.canActivate).toEqual([redirectToAnchorGuard]);
		}
	});

	it("keeps the section aliases ahead of the project catch-all", () => {
		const catchAll = pathOf(":id");

		for (const section of SECTIONS) {
			expect(pathOf(section.routeAlias)).toBeLessThan(catchAll);
		}
	});

	it("keeps the empty path first and the wildcard last", () => {
		expect(routes[0].path).toBe("");
		expect(routes[routes.length - 1].path).toBe("**");
	});
});
