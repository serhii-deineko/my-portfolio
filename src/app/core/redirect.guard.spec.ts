import { TestBed } from "@angular/core/testing";
import {
	ActivatedRouteSnapshot,
	provideRouter,
	Router,
	RouterStateSnapshot
} from "@angular/router";
import { redirectToAnchorGuard } from "./redirect.guard";
import { SECTIONS } from "./sections";

describe("redirectToAnchorGuard", () => {
	let router: Router;
	let navigate: ReturnType<typeof vi.spyOn>;

	const runGuard = (path: string | undefined) =>
		TestBed.runInInjectionContext(() =>
			redirectToAnchorGuard(
				{ routeConfig: path === undefined ? null : { path } } as ActivatedRouteSnapshot,
				{} as RouterStateSnapshot
			)
		);

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		router = TestBed.inject(Router);
		navigate = vi.spyOn(router, "navigate").mockResolvedValue(true);
	});

	it("maps the about path to the hero anchor", () => {
		expect(runGuard("about")).toBe(false);
		expect(navigate).toHaveBeenCalledWith(["/"], { fragment: "hero" });
	});

	it("maps the singular project path to the projects anchor", () => {
		expect(runGuard("project")).toBe(false);
		expect(navigate).toHaveBeenCalledWith(["/"], { fragment: "projects" });
	});

	it.each(SECTIONS)("redirects the $routeAlias path to the $id anchor", (section) => {
		expect(runGuard(section.routeAlias)).toBe(false);
		expect(navigate).toHaveBeenCalledWith(["/"], { fragment: section.id });
	});

	it("lets unknown paths through untouched", () => {
		expect(runGuard("some-project-id")).toBe(true);
		expect(navigate).not.toHaveBeenCalled();
	});

	it("lets a route without configuration through untouched", () => {
		expect(runGuard(undefined)).toBe(true);
		expect(navigate).not.toHaveBeenCalled();
	});
});
