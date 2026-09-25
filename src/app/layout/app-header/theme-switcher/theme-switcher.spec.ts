import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { StorageService } from "../../../core/storage";
import { ThemeService } from "../../../core/theme";
import { ThemeSwitcherComponent } from "./theme-switcher";

describe("ThemeSwitcherComponent", () => {
	let fixture: ComponentFixture<ThemeSwitcherComponent>;
	let themeService: ThemeService;

	const checkbox = (): HTMLInputElement =>
		fixture.nativeElement.querySelector(".theme-switcher__input");

	const createComponent = () => {
		fixture = TestBed.createComponent(ThemeSwitcherComponent);
		fixture.detectChanges();
		themeService = TestBed.inject(ThemeService);
	};

	beforeEach(async () => {
		localStorage.clear();
		document.body.className = "";

		await TestBed.configureTestingModule({
			imports: [ThemeSwitcherComponent],
			providers: [provideTranslateTesting()]
		}).compileComponents();

		setTestTranslations({ uni: { "toggle-theme": "Toggle theme" } });
	});

	afterEach(() => {
		document.body.className = "";
	});

	it("reflects the dark theme with an unchecked box", () => {
		createComponent();

		expect(themeService.isDark()).toBe(true);
		expect(checkbox().checked).toBe(false);
	});

	it("reflects the stored light theme with a checked box", () => {
		TestBed.inject(StorageService).setItem("theme", "light");

		createComponent();

		expect(themeService.isDark()).toBe(false);
		expect(checkbox().checked).toBe(true);
	});

	it("delegates toggling to the theme service", () => {
		createComponent();

		checkbox().dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(themeService.isDark()).toBe(false);
		expect(checkbox().checked).toBe(true);
		expect(document.body.classList.contains("light-mode")).toBe(true);
	});

	it("labels the checkbox for assistive technology", () => {
		createComponent();

		expect(checkbox().getAttribute("aria-label")).toBe("Toggle theme");
	});
});
