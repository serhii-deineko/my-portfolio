import { TestBed } from "@angular/core/testing";
import { PageLoadingService } from "./page-loading";

const MINIMUM_VISIBLE_MS = 500;

describe("PageLoadingService", () => {
	let service: PageLoadingService;

	beforeEach(() => {
		vi.useFakeTimers();
		document.body.style.overflow = "";
		TestBed.configureTestingModule({});
		service = TestBed.inject(PageLoadingService);
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.style.overflow = "";
	});

	it("starts in the loading state with scrolling locked", () => {
		expect(service.isLoading()).toBe(true);
		expect(document.body.style.overflow).toBe("hidden");
	});

	it("keeps the loader visible until the minimum duration has elapsed", () => {
		service.ready();

		vi.advanceTimersByTime(MINIMUM_VISIBLE_MS - 1);
		expect(service.isLoading()).toBe(true);

		vi.advanceTimersByTime(1);
		expect(service.isLoading()).toBe(false);
		expect(document.body.style.overflow).toBe("");
	});

	it("reveals immediately when the minimum duration already passed", () => {
		vi.advanceTimersByTime(MINIMUM_VISIBLE_MS);

		service.ready();

		expect(service.isLoading()).toBe(false);
		expect(document.body.style.overflow).toBe("");
	});

	it("cancels a pending reveal when a new page starts loading", () => {
		service.ready();
		service.start();

		vi.advanceTimersByTime(MINIMUM_VISIBLE_MS * 2);

		expect(service.isLoading()).toBe(true);
		expect(document.body.style.overflow).toBe("hidden");
	});

	it("restarts the minimum visible window on every start", () => {
		vi.advanceTimersByTime(MINIMUM_VISIBLE_MS);
		service.start();

		service.ready();

		expect(service.isLoading()).toBe(true);

		vi.advanceTimersByTime(MINIMUM_VISIBLE_MS);
		expect(service.isLoading()).toBe(false);
	});
});
