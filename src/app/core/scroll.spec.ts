import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { ScrollService } from "./scroll";

const PROGRESS_CLASS = "app__progress";
const HEADER_BAND_ROOT_MARGIN = "0px 0px -70% 0px";

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

interface StubbedObserver {
	callback: ObserverCallback;
	rootMargin?: string;
	observed: Element[];
	disconnected: boolean;
}

describe("ScrollService", () => {
	let service: ScrollService;
	let observers: StubbedObserver[];
	let originalScrollY: PropertyDescriptor | undefined;

	const renderSections = (markup: string) => {
		document.body.innerHTML = markup;
	};

	const setScrollY = (value: number) => {
		Object.defineProperty(window, "scrollY", { value, configurable: true });
	};

	const restoreScrollY = () => {
		if (originalScrollY) {
			Object.defineProperty(window, "scrollY", originalScrollY);
			return;
		}
		delete (window as unknown as Record<string, unknown>)["scrollY"];
	};

	const viewportObserver = () => observers.find((observer) => !observer.rootMargin);

	const headerBandObserver = () => observers.find((observer) => observer.rootMargin);

	beforeEach(() => {
		observers = [];
		originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");

		vi.stubGlobal(
			"IntersectionObserver",
			class {
				private readonly record: StubbedObserver;

				constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
					this.record = {
						callback,
						rootMargin: options?.rootMargin,
						observed: [],
						disconnected: false
					};
					observers.push(this.record);
				}

				observe(element: Element) {
					this.record.observed.push(element);
				}

				disconnect() {
					this.record.disconnected = true;
				}

				unobserve = vi.fn();
				takeRecords = vi.fn(() => []);
			}
		);

		TestBed.configureTestingModule({ providers: [provideRouter([])] });
		service = TestBed.inject(ScrollService);
	});

	afterEach(() => {
		document.body.innerHTML = "";
		restoreScrollY();
		vi.unstubAllGlobals();
	});

	it("reports no sections before initialisation", () => {
		expect(service.hasSections()).toBe(false);
		expect(service.trackedSections()).toEqual([]);
	});

	it("tracks only the section ids that exist in the document", () => {
		renderSections(`<div id="hero"></div><div id="projects"></div>`);

		service.init(["hero", "projects", "not-rendered"], PROGRESS_CLASS);

		expect(service.hasSections()).toBe(true);
		expect(service.trackedSections()).toEqual(["hero", "projects"]);
	});

	it("drops tracked sections when the list is emptied", () => {
		renderSections(`<div id="hero"></div>`);
		service.init(["hero"], PROGRESS_CLASS);

		service.updateSections([]);

		expect(service.hasSections()).toBe(false);
		expect(service.trackedSections()).toEqual([]);
	});

	it("scrolls the requested section into view", () => {
		renderSections(`<div id="hero"></div>`);
		const hero = document.getElementById("hero");
		const scrollIntoView = vi.fn();
		hero!.scrollIntoView = scrollIntoView;

		service.scrollTo("hero");

		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
	});

	it("ignores a scroll request for an unknown section", () => {
		expect(() => service.scrollTo("nowhere")).not.toThrow();
	});

	it("renders the scroll progress onto the progress bar", () => {
		renderSections(`<div class="${PROGRESS_CLASS}"></div><div id="hero"></div>`);
		service.init(["hero"], PROGRESS_CLASS);

		service.updateSections(["hero"]);

		const progressBar = document.querySelector<HTMLElement>(`.${PROGRESS_CLASS}`);
		expect(progressBar?.style.transform).toBe("scaleX(0)");
	});

	it("starts with an empty active section", () => {
		expect(service.activeSection()).toBe("");
	});

	it("exposes the section the viewport is anchored on", () => {
		renderSections(`<div id="hero"></div><div id="projects"></div>`);

		const projects = document.getElementById("projects");
		projects!.getBoundingClientRect = () => ({ top: 0, bottom: 1000 }) as unknown as DOMRect;
		const hero = document.getElementById("hero");
		hero!.getBoundingClientRect = () => ({ top: -1000, bottom: 0 }) as unknown as DOMRect;

		service.init(["hero", "projects"], PROGRESS_CLASS);

		expect(service.activeSection()).toBe("projects");
	});

	it("clears the active section on demand", () => {
		renderSections(`<div id="hero"></div>`);
		service.init(["hero"], PROGRESS_CLASS);
		expect(service.activeSection()).toBe("hero");

		service.clearActiveSection();

		expect(service.activeSection()).toBe("");
	});

	it("publishes the current scroll position as a signal", () => {
		renderSections(`<div id="hero"></div>`);
		service.init(["hero"], PROGRESS_CLASS);
		expect(service.scrollPosition()).toBe(0);

		setScrollY(640);
		service.updateSections(["hero"]);

		expect(service.scrollPosition()).toBe(640);
	});

	it("leaves the contact signals down when the section is missing", () => {
		renderSections(`<div id="hero"></div>`);

		service.init(["hero"], PROGRESS_CLASS);

		expect(observers).toHaveLength(0);
		expect(service.isContactVisible()).toBe(false);
		expect(service.isContactUnderHeader()).toBe(false);
	});

	it("watches the contact section with a viewport and a header-band observer", () => {
		renderSections(`<div id="hero"></div><div id="contact"></div>`);

		service.init(["hero", "contact"], PROGRESS_CLASS);

		const contact = document.getElementById("contact");
		expect(observers).toHaveLength(2);
		expect(viewportObserver()?.observed).toEqual([contact]);
		expect(headerBandObserver()?.rootMargin).toBe(HEADER_BAND_ROOT_MARGIN);
		expect(headerBandObserver()?.observed).toEqual([contact]);
	});

	it("raises the visibility signal as soon as the contact section enters the viewport", () => {
		renderSections(`<div id="contact"></div>`);
		service.init(["contact"], PROGRESS_CLASS);

		viewportObserver()?.callback([{ isIntersecting: true }]);

		expect(service.isContactVisible()).toBe(true);
		expect(service.isContactUnderHeader()).toBe(false);
	});

	it("raises the under-header signal only from the header-band observer", () => {
		renderSections(`<div id="contact"></div>`);
		service.init(["contact"], PROGRESS_CLASS);

		headerBandObserver()?.callback([{ isIntersecting: true }]);

		expect(service.isContactUnderHeader()).toBe(true);
		expect(service.isContactVisible()).toBe(false);
	});

	it("rebinds the observers and resets the signals when sections are re-scanned", () => {
		renderSections(`<div id="contact"></div>`);
		service.init(["contact"], PROGRESS_CLASS);
		viewportObserver()?.callback([{ isIntersecting: true }]);
		const initialObservers = [...observers];

		service.updateSections(["contact"]);

		expect(initialObservers.every((observer) => observer.disconnected)).toBe(true);
		expect(observers).toHaveLength(4);
		expect(service.isContactVisible()).toBe(false);
	});

	it("drops the contact signals when the section leaves the page", () => {
		renderSections(`<div id="contact"></div>`);
		service.init(["contact"], PROGRESS_CLASS);
		viewportObserver()?.callback([{ isIntersecting: true }]);

		renderSections(`<div id="hero"></div>`);
		service.updateSections(["hero"]);

		expect(service.isContactVisible()).toBe(false);
		expect(service.isContactUnderHeader()).toBe(false);
	});
});
