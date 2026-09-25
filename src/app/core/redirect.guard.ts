import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { SectionId, SECTIONS } from "./sections";

const SECTION_ANCHORS: Record<string, SectionId> = Object.fromEntries(
	SECTIONS.map((section) => [section.routeAlias, section.id])
);

export const redirectToAnchorGuard: CanActivateFn = (route) => {
	const router = inject(Router);
	const anchor = SECTION_ANCHORS[route.routeConfig?.path ?? ""];

	if (anchor) {
		router.navigate(["/"], { fragment: anchor });
		return false;
	}

	return true;
};
