import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { AVAILABLE_LANGUAGES } from "../../../core/i18n/languages.constants";
import { LanguageService } from "../../../core/language";
import { StorageService } from "../../../core/storage";
import { LanguageSwitcherComponent } from "./language-switcher";

describe("LanguageSwitcherComponent", () => {
	let fixture: ComponentFixture<LanguageSwitcherComponent>;
	let component: LanguageSwitcherComponent;
	let languageService: LanguageService;
	let storageService: StorageService;

	const trigger = (): HTMLButtonElement =>
		fixture.nativeElement.querySelector(".language-switcher");

	const createComponent = () => {
		fixture = TestBed.createComponent(LanguageSwitcherComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	};

	beforeEach(async () => {
		localStorage.clear();

		await TestBed.configureTestingModule({
			imports: [LanguageSwitcherComponent],
			providers: [provideTranslateTesting()]
		}).compileComponents();

		setTestTranslations({ uni: { "change-language": "Change language" } });
		languageService = TestBed.inject(LanguageService);
		storageService = TestBed.inject(StorageService);
	});

	afterEach(() => {
		document.head
			.querySelectorAll('meta[property^="og:locale"]')
			.forEach((element) => element.remove());
	});

	it("offers every supported language", () => {
		createComponent();

		expect(component["availableLanguages"]).toEqual(AVAILABLE_LANGUAGES);
	});

	it("shows the active language code on the trigger", () => {
		createComponent();

		expect(trigger().textContent).toContain("en");
	});

	it("starts from the language restored out of storage", () => {
		storageService.setItem("language", "pl");
		languageService.initLanguage();

		createComponent();

		expect(trigger().textContent).toContain("pl");
	});

	it("delegates a language change to the language service", () => {
		createComponent();
		const setLanguage = vi.spyOn(languageService, "setLanguage");

		component["setLanguage"]("de");

		expect(setLanguage).toHaveBeenCalledWith("de");
	});

	it("follows a language change made elsewhere in the app", () => {
		createComponent();

		languageService.setLanguage("fr");
		fixture.detectChanges();

		expect(trigger().textContent).toContain("fr");
		expect(trigger().getAttribute("aria-label")).toBe("Change language: French");
	});

	it("describes the trigger with the full language name", () => {
		createComponent();

		expect(trigger().getAttribute("aria-label")).toBe("Change language: English");
	});
});
