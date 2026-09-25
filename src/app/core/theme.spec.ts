import { TestBed } from "@angular/core/testing";
import { StorageService } from "./storage";
import { ThemeService } from "./theme";

describe("ThemeService", () => {
	const createService = (): ThemeService => TestBed.inject(ThemeService);

	beforeEach(() => {
		localStorage.clear();
		document.body.className = "";
		TestBed.configureTestingModule({});
	});

	afterEach(() => {
		document.body.className = "";
	});

	it("defaults to dark mode when nothing is stored", () => {
		const service = createService();

		expect(service.isDark()).toBe(true);
		expect(document.body.classList.contains("dark-mode")).toBe(true);
		expect(document.body.classList.contains("light-mode")).toBe(false);
	});

	it("restores light mode from storage", () => {
		TestBed.inject(StorageService).setItem("theme", "light");

		const service = createService();

		expect(service.isDark()).toBe(false);
		expect(document.body.classList.contains("light-mode")).toBe(true);
		expect(document.body.classList.contains("dark-mode")).toBe(false);
	});

	it("falls back to dark mode for an unknown stored value", () => {
		TestBed.inject(StorageService).setItem("theme", "sepia");

		expect(createService().isDark()).toBe(true);
	});

	it("persists the theme and swaps the body classes when toggled", () => {
		const storageService = TestBed.inject(StorageService);
		const service = createService();

		service.toggle();
		TestBed.tick();

		expect(service.isDark()).toBe(false);
		expect(storageService.getItem("theme")).toBe("light");
		expect(document.body.classList.contains("light-mode")).toBe(true);
		expect(document.body.classList.contains("dark-mode")).toBe(false);

		service.toggle();
		TestBed.tick();

		expect(service.isDark()).toBe(true);
		expect(storageService.getItem("theme")).toBe("dark");
		expect(document.body.classList.contains("dark-mode")).toBe(true);
		expect(document.body.classList.contains("light-mode")).toBe(false);
	});
});
