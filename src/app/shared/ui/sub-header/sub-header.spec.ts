import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubHeaderComponent } from "./sub-header";

@Component({
	selector: "app-sub-header-host",
	imports: [SubHeaderComponent],
	template: `
		<app-sub-header [count]="count()" [headingId]="headingId()">Experience</app-sub-header>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
	readonly count = signal<unknown>(undefined);
	readonly headingId = signal<string | undefined>(undefined);
}

describe("SubHeaderComponent", () => {
	let fixture: ComponentFixture<HostComponent>;
	let host: HostComponent;

	const heading = (): HTMLHeadingElement => fixture.nativeElement.querySelector(".sub-header");

	const countLabel = (): string | undefined =>
		fixture.nativeElement.querySelector(".sub-header__count")?.textContent?.trim();

	const render = (count: unknown): void => {
		host.count.set(count);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("projects the heading text into a level-two heading", () => {
		expect(heading().tagName).toBe("H2");
		expect(heading().textContent?.trim()).toBe("Experience");
	});

	it("pads the length of a collection to two digits", () => {
		render([1, 2, 3]);

		expect(countLabel()).toBe("03");
	});

	it("pads a plain number to two digits", () => {
		render(7);

		expect(countLabel()).toBe("07");
	});

	it("keeps counts of three digits or more intact", () => {
		render(123);

		expect(countLabel()).toBe("123");
	});

	it("renders no count when the value is neither a collection nor a number", () => {
		render("projects.items");

		expect(countLabel()).toBeUndefined();
	});

	it("renders no count when the value is missing", () => {
		render(undefined);

		expect(countLabel()).toBeUndefined();
	});

	it("hides the count from assistive technology", () => {
		render([1]);

		const count = fixture.nativeElement.querySelector(".sub-header__count");

		expect(count?.getAttribute("aria-hidden")).toBe("true");
	});

	it("carries no id until one is requested", () => {
		expect(heading().hasAttribute("id")).toBe(false);
	});

	it("puts the requested id on the heading so a section can label itself", () => {
		host.headingId.set("cases-heading");
		fixture.detectChanges();

		expect(heading().getAttribute("id")).toBe("cases-heading");
	});
});
