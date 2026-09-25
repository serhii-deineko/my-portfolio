import { TestBed } from "@angular/core/testing";
import { Meta } from "@angular/platform-browser";
import { provideTranslateTesting } from "../../testing/translate.testing";
import { LanguageService } from "./language";
import { StorageService } from "./storage";

describe("LanguageService", () => {
	let service: LanguageService;
	let storageService: StorageService;
	let meta: Meta;

	beforeEach(() => {
		localStorage.clear();
		document.documentElement.lang = "";
		TestBed.configureTestingModule({ providers: [provideTranslateTesting()] });

		service = TestBed.inject(LanguageService);
		storageService = TestBed.inject(StorageService);
		meta = TestBed.inject(Meta);
	});

	afterEach(() => {
		document.head
			.querySelectorAll('meta[property^="og:locale"]')
			.forEach((element) => element.remove());
	});

	it("persists the selected language and mirrors it on the document", () => {
		service.setLanguage("pl");

		expect(service.language()).toBe("pl");
		expect(document.documentElement.lang).toBe("pl");
		expect(storageService.getItem("language")).toBe("pl");
	});

	it("restores the previously stored language on init", () => {
		storageService.setItem("language", "de");

		service.initLanguage();

		expect(service.language()).toBe("de");
	});

	it("falls back to the translate service language when nothing is stored", () => {
		service.initLanguage();

		expect(service.language()).toBe("en");
	});

	it("publishes the active locale and its alternates as open graph tags", () => {
		service.setLanguage("fr");

		const alternates = meta.getTags('property="og:locale:alternate"').map((tag) => tag.content);

		expect(meta.getTag('property="og:locale"')?.content).toBe("fr_FR");
		expect(alternates).toContain("en_US");
		expect(alternates).toContain("uk_UA");
		expect(alternates).not.toContain("fr_FR");
	});

	it("publishes every language change on the signal", () => {
		service.setLanguage("ua");

		expect(service.language()).toBe("ua");
	});
});
