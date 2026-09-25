import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { CtaButtonComponent } from "./cta-button";

describe("CtaButtonComponent", () => {
	let fixture: ComponentFixture<CtaButtonComponent>;

	const anchor = (): HTMLAnchorElement => fixture.nativeElement.querySelector("a");

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CtaButtonComponent],
			providers: [provideTranslateTesting(), provideRouter([])]
		}).compileComponents();

		setTestTranslations({
			uni: {
				downloading: "Downloading",
				downloaded: "Downloaded",
				"download-failed": "Download failed"
			}
		});

		fixture = TestBed.createComponent(CtaButtonComponent);
		fixture.componentRef.setInput("buttonText", "Download CV");
	});

	it("renders the label it was given", () => {
		fixture.detectChanges();

		expect(anchor().textContent?.trim()).toBe("Download CV");
	});

	it("renders a router link when one is provided", () => {
		fixture.componentRef.setInput("routerLink", "/project/aisema-ai-grant-advisor");
		fixture.detectChanges();

		expect(anchor().getAttribute("href")).toBe("/project/aisema-ai-grant-advisor");
		expect(anchor().getAttribute("target")).toBeNull();
	});

	it("opens an external target in a new tab with a safe rel", () => {
		fixture.componentRef.setInput("targetUrl", "https://example.com");
		fixture.detectChanges();

		expect(anchor().getAttribute("href")).toBe("https://example.com");
		expect(anchor().getAttribute("target")).toBe("_blank");
		expect(anchor().getAttribute("rel")).toBe("noopener noreferrer");
	});

	it("marks a file url as a download with the configured file name", () => {
		fixture.componentRef.setInput("fileUrl", "cv.pdf");
		fixture.componentRef.setInput("fileName", "Serhii Deineko.pdf");
		fixture.detectChanges();

		expect(anchor().getAttribute("href")).toBe("cv.pdf");
		expect(anchor().getAttribute("download")).toBe("Serhii Deineko.pdf");
		expect(anchor().getAttribute("target")).toBeNull();
	});

	it("lets the browser name the file when no file name is configured", () => {
		fixture.componentRef.setInput("fileUrl", "cv.pdf");
		fixture.detectChanges();

		expect(anchor().getAttribute("href")).toBe("cv.pdf");
		expect(anchor().getAttribute("download")).toBe("");
	});

	it("prefers an external target over a file download", () => {
		fixture.componentRef.setInput("targetUrl", "https://example.com");
		fixture.componentRef.setInput("fileUrl", "cv.pdf");
		fixture.detectChanges();

		expect(anchor().getAttribute("href")).toBe("https://example.com");
		expect(anchor().getAttribute("download")).toBeNull();
	});

	it("renders an icon only when one is configured", () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector("mat-icon")).toBeNull();

		fixture.componentRef.setInput("buttonIcon", "arrow_downward");
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector("mat-icon")).not.toBeNull();
	});

	it("applies the accessible label when provided", () => {
		fixture.componentRef.setInput("ariaLabel", "Download my CV");
		fixture.detectChanges();

		expect(anchor().getAttribute("aria-label")).toBe("Download my CV");
	});

	describe("file download feedback", () => {
		const spinnerDelayMs = 150;
		const spinnerMinVisibleMs = 500;
		const resultVisibleMs = 1600;

		let fetchMock: ReturnType<typeof vi.fn>;
		let savedDownloads: string[];
		let respond: (response: unknown) => void;

		const spinner = (): HTMLElement | null =>
			fixture.nativeElement.querySelector("mat-spinner");
		const iconName = (): string | null | undefined =>
			fixture.nativeElement.querySelector("mat-icon")?.getAttribute("fontIcon");
		const status = (): string | undefined =>
			fixture.nativeElement.querySelector(".cta-button__status")?.textContent?.trim();

		const pdfResponse = {
			ok: true,
			blob: () => Promise.resolve(new Blob(["cv"], { type: "application/pdf" }))
		};

		const click = (): void => {
			anchor().dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		};

		const advance = async (ms: number): Promise<void> => {
			await vi.advanceTimersByTimeAsync(ms);
			fixture.detectChanges();
		};

		beforeEach(() => {
			vi.useFakeTimers();

			savedDownloads = [];
			vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
				this: HTMLAnchorElement
			) {
				savedDownloads.push(this.download);
			});

			URL.createObjectURL = vi.fn(() => "blob:cv");
			URL.revokeObjectURL = vi.fn();

			fetchMock = vi.fn(() => new Promise((resolve) => (respond = resolve)));
			vi.stubGlobal("fetch", fetchMock);

			fixture.componentRef.setInput("fileUrl", "cv/en/CV — Serhii Deineko.pdf");
			fixture.componentRef.setInput("buttonIcon", "arrow_downward");
			fixture.detectChanges();
		});

		afterEach(() => {
			vi.useRealTimers();
			vi.unstubAllGlobals();
			vi.restoreAllMocks();
		});

		it("fetches the file itself instead of letting the browser navigate", async () => {
			click();
			await advance(0);

			expect(fetchMock).toHaveBeenCalledWith("cv/en/CV — Serhii Deineko.pdf");
		});

		it("holds the spinner back so a fast download never flashes it", async () => {
			click();
			await advance(spinnerDelayMs - 10);

			expect(spinner()).toBeNull();

			respond(pdfResponse);
			await advance(spinnerDelayMs);

			expect(spinner()).toBeNull();
			expect(iconName()).toBe("check");
		});

		it("shows the spinner in place of the icon once the wait drags on", async () => {
			click();
			await advance(spinnerDelayMs);

			expect(spinner()).not.toBeNull();
			expect(status()).toBe("Downloading");
			expect(fixture.nativeElement.querySelector("mat-icon")).not.toBeNull();
			expect(fixture.nativeElement.querySelector(".cta-button__icon--faded")).not.toBeNull();
		});

		it("keeps a shown spinner up long enough to be read", async () => {
			click();
			await advance(spinnerDelayMs);

			respond(pdfResponse);
			await advance(spinnerMinVisibleMs - 10);

			expect(spinner()).not.toBeNull();

			await advance(10);

			expect(spinner()).toBeNull();
		});

		it("confirms the finished download and then returns to the plain icon", async () => {
			click();
			respond(pdfResponse);
			await advance(spinnerDelayMs);

			expect(iconName()).toBe("check");
			expect(status()).toBe("Downloaded");
			expect(savedDownloads).toEqual(["CV — Serhii Deineko.pdf"]);

			await advance(resultVisibleMs);

			expect(iconName()).toBe("arrow_downward");
			expect(status()).toBe("");
		});

		it("ignores a second click while the file is still on its way", async () => {
			click();
			await advance(spinnerDelayMs);

			click();
			click();
			await advance(0);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(anchor().getAttribute("aria-busy")).toBe("true");
		});

		it("takes a new download once the previous one is confirmed", async () => {
			click();
			respond(pdfResponse);
			await advance(spinnerDelayMs);

			click();
			await advance(0);

			expect(fetchMock).toHaveBeenCalledTimes(2);
		});

		it("falls back to the browser when the fetch fails", async () => {
			click();
			respond(Promise.reject(new Error("offline")));
			await advance(spinnerDelayMs);

			expect(iconName()).toBe("error_outline");
			expect(status()).toBe("Download failed");
			expect(savedDownloads).toEqual(["CV — Serhii Deineko.pdf"]);
		});

		it("leaves clicks with a modifier key to the browser", async () => {
			anchor().dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true })
			);
			await advance(0);

			expect(fetchMock).not.toHaveBeenCalled();
		});

		it("does not intercept an external link", async () => {
			fixture.componentRef.setInput("targetUrl", "https://example.com");
			fixture.detectChanges();

			click();
			await advance(0);

			expect(fetchMock).not.toHaveBeenCalled();
		});
	});
});
