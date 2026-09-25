import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	injectScrollServiceStub,
	provideScrollServiceStub,
	ScrollServiceStub
} from "../testing/scroll.stub";
import { provideTranslateTesting, setTestTranslations } from "../testing/translate.testing";
import { AppComponent } from "./app";
import { LanguageService } from "./core/language";
import { PageLoadingService } from "./core/page-loading";
import { ScrollService } from "./core/scroll";
import { StorageService } from "./core/storage";

describe("AppComponent", () => {
	let fixture: ComponentFixture<AppComponent>;
	let scrollService: ScrollServiceStub;
	let storageService: StorageService;

	const host = (): HTMLElement => fixture.nativeElement;

	const createComponent = async () => {
		fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	};

	beforeEach(async () => {
		localStorage.clear();
		document.body.className = "";

		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [provideRouter([]), provideTranslateTesting(), provideScrollServiceStub()]
		}).compileComponents();

		setTestTranslations({
			header: {
				home: "Home",
				menu: "Menu",
				nav: {
					main: "Main navigation",
					about: "About",
					projects: "Projects",
					experience: "Experience",
					contact: "Contact"
				}
			},
			contact: { title: "Contact", copyright: "© {{year}}" },
			uni: {
				"skip-to-content": "Skip to content",
				loading: "Loading",
				"change-language": "Change language",
				"toggle-theme": "Toggle theme"
			}
		});

		scrollService = injectScrollServiceStub(TestBed.inject(ScrollService));
		storageService = TestBed.inject(StorageService);
	});

	afterEach(() => {
		document.body.className = "";
	});

	it("renders the shell with the header, outlet and global footer", async () => {
		await createComponent();

		expect(fixture.nativeElement.querySelector("app-header")).not.toBeNull();
		expect(fixture.nativeElement.querySelector("router-outlet")).not.toBeNull();
		expect(fixture.nativeElement.querySelector("app-footer")).not.toBeNull();
	});

	it("mounts the contact section in the shell so every route shows it", async () => {
		await createComponent();
		const contact = fixture.nativeElement.querySelector("app-contact");

		expect(contact).not.toBeNull();
		expect(contact.getAttribute("id")).toBe("contact");
		expect(contact.getAttribute("aria-label")).toBe("Contact");
	});

	it("owns the contact anchor exactly once", async () => {
		await createComponent();

		expect(fixture.nativeElement.querySelectorAll("#contact")).toHaveLength(1);
	});

	it("renders a skip link pointing at the main landmark", async () => {
		await createComponent();
		const skipLink = host().querySelector<HTMLAnchorElement>(".app__skip-link");

		expect(skipLink?.getAttribute("href")).toBe("#main-content");
		expect(skipLink?.textContent?.trim()).toBe("Skip to content");
	});

	it("registers the page sections and the progress bar with the scroll service", async () => {
		await createComponent();

		expect(scrollService.init).toHaveBeenCalledWith(
			["hero", "projects", "experience", "contact"],
			"app__progress"
		);
	});

	it("applies dark mode when no theme was stored", async () => {
		await createComponent();

		expect(document.body.classList.contains("dark-mode")).toBe(true);
		expect(document.body.classList.contains("light-mode")).toBe(false);
	});

	it("applies the stored light theme on start up", async () => {
		storageService.setItem("theme", "light");

		await createComponent();

		expect(document.body.classList.contains("light-mode")).toBe(true);
		expect(document.body.classList.contains("dark-mode")).toBe(false);
	});

	it("initialises the application language", async () => {
		const languageService = TestBed.inject(LanguageService);
		const initLanguage = vi.spyOn(languageService, "initLanguage");

		await createComponent();

		expect(initLanguage).toHaveBeenCalled();
	});

	it("shows the loading spinner while a page is loading", async () => {
		await createComponent();
		const spinner = fixture.nativeElement.querySelector(".app__spinner");

		expect(TestBed.inject(PageLoadingService).isLoading()).toBe(true);
		expect(spinner.classList.contains("app__spinner--active")).toBe(true);
	});

	it("hides the loading spinner once the page is ready", async () => {
		await createComponent();

		vi.useFakeTimers();
		TestBed.inject(PageLoadingService).ready();
		vi.advanceTimersByTime(1000);
		vi.useRealTimers();
		fixture.detectChanges();

		const spinner = fixture.nativeElement.querySelector(".app__spinner");
		expect(spinner.classList.contains("app__spinner--active")).toBe(false);
	});
});
