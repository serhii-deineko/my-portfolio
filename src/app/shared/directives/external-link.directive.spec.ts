import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ExternalLinkDirective } from "./external-link.directive";

@Component({
	imports: [ExternalLinkDirective],
	template: `
		<a [href]="href()" [appExternalLink]="href()">link</a>
	`
})
class HostComponent {
	readonly href = signal<string | undefined>(undefined);
}

describe("ExternalLinkDirective", () => {
	let fixture: ComponentFixture<HostComponent>;

	const anchor = (): HTMLAnchorElement => fixture.nativeElement.querySelector("a");

	const setHref = (href: string | undefined) => {
		fixture.componentInstance.href.set(href);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it("opens an http(s) link in a new tab with a safe rel", () => {
		setHref("https://example.com");

		expect(anchor().getAttribute("target")).toBe("_blank");
		expect(anchor().getAttribute("rel")).toBe("noopener noreferrer");
	});

	it("keeps a mailto link in the same tab", () => {
		setHref("mailto:serhii.deineko@gmail.com");

		expect(anchor().getAttribute("target")).toBeNull();
		expect(anchor().getAttribute("rel")).toBeNull();
	});

	it("keeps a relative link in the same tab", () => {
		setHref("cv.pdf");

		expect(anchor().getAttribute("target")).toBeNull();
		expect(anchor().getAttribute("rel")).toBeNull();
	});

	it("keeps an anchor without an url in the same tab", () => {
		expect(anchor().getAttribute("target")).toBeNull();
		expect(anchor().getAttribute("rel")).toBeNull();
	});

	it("drops the attributes when the url stops being external", () => {
		setHref("https://example.com");
		setHref("#contact");

		expect(anchor().getAttribute("target")).toBeNull();
		expect(anchor().getAttribute("rel")).toBeNull();
	});
});
