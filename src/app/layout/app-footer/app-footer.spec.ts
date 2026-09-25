import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
	injectScrollServiceStub,
	provideScrollServiceStub,
	ScrollServiceStub
} from "../../../testing/scroll.stub";
import { ScrollService } from "../../core/scroll";
import { CONTACT_CHANNELS } from "../layout.constants";
import { AppFooterComponent } from "./app-footer";

describe("AppFooterComponent", () => {
	let fixture: ComponentFixture<AppFooterComponent>;
	let scrollService: ScrollServiceStub;

	const footer = (): HTMLElement | null => fixture.nativeElement.querySelector(".footer");

	const links = (): HTMLAnchorElement[] =>
		Array.from(fixture.nativeElement.querySelectorAll(".footer__link"));

	const scrollTo = (scrollPosition: number) => {
		scrollService.scrollPosition.set(scrollPosition);
		fixture.detectChanges();
	};

	const showContactSection = (isVisible: boolean) => {
		scrollService.isContactVisible.set(isVisible);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppFooterComponent],
			providers: [provideRouter([]), provideScrollServiceStub()]
		}).compileComponents();

		scrollService = injectScrollServiceStub(TestBed.inject(ScrollService));
		fixture = TestBed.createComponent(AppFooterComponent);
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	});

	it("stays hidden near the top of the page", () => {
		expect(footer()).toBeNull();
	});

	it("appears once the page is scrolled down", () => {
		scrollTo(800);

		expect(footer()).not.toBeNull();
	});

	it("hides again when scrolled back to the top", () => {
		scrollTo(800);
		scrollTo(0);

		expect(footer()).toBeNull();
	});

	it("gives way to the contact section as soon as it enters the viewport", () => {
		scrollTo(800);

		showContactSection(true);

		expect(footer()).toBeNull();
	});

	it("comes back once the contact section leaves the viewport", () => {
		scrollTo(800);
		showContactSection(true);

		showContactSection(false);

		expect(footer()).not.toBeNull();
	});

	it("renders one icon link per contact channel", () => {
		scrollTo(800);

		expect(links()).toHaveLength(CONTACT_CHANNELS.length);
		expect(footer()?.querySelectorAll("app-social-icon")).toHaveLength(CONTACT_CHANNELS.length);
	});

	it("opens external channels in a new tab with a safe rel", () => {
		scrollTo(800);
		const external = links().filter((link) => link.getAttribute("target") === "_blank");

		expect(external).toHaveLength(4);
		external.forEach((link) => expect(link.getAttribute("rel")).toBe("noopener noreferrer"));
	});

	it("labels every icon link for assistive technology", () => {
		scrollTo(800);

		links().forEach((link) => expect(link.getAttribute("aria-label")).toBeTruthy());
	});

	it("does not render the contact section", () => {
		scrollTo(800);

		expect(fixture.nativeElement.querySelector(".contact")).toBeNull();
	});
});
