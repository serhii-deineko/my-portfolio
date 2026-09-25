import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SocialIconComponent, SocialIconName } from "./social-icon";

@Component({
	selector: "app-social-icon-host",
	imports: [SocialIconComponent],
	template: `
		<app-social-icon class="contact__icon" [name]="name()" [size]="size()" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
	readonly name = signal<SocialIconName>("github");
	readonly size = signal<string | undefined>(undefined);
}

describe("SocialIconComponent", () => {
	let fixture: ComponentFixture<HostComponent>;
	let host: HostComponent;

	const icon = (): HTMLElement => fixture.nativeElement.querySelector("app-social-icon");

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("marks the icon as decorative", () => {
		expect(icon().getAttribute("aria-hidden")).toBe("true");
	});

	it("names the brand through a modifier class the stylesheet can hook onto", () => {
		expect(icon().classList).toContain("social-icon");
		expect(icon().classList).toContain("social-icon--github");
	});

	it("keeps the class the consumer put on the element", () => {
		expect(icon().classList).toContain("contact__icon");
	});

	it("swaps the modifier class when the brand changes", () => {
		host.name.set("telegram");
		fixture.detectChanges();

		expect(icon().classList).toContain("social-icon--telegram");
		expect(icon().classList).not.toContain("social-icon--github");
	});

	it("leaves the size to the stylesheet until one is requested", () => {
		expect(icon().style.getPropertyValue("--social-icon-size")).toBe("");
	});

	it("applies a requested size as a custom property", () => {
		host.size.set("0.18rem");
		fixture.detectChanges();

		expect(icon().style.getPropertyValue("--social-icon-size")).toBe("0.18rem");
	});
});
