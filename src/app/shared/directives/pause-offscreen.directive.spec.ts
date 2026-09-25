import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PauseOffscreenDirective } from "./pause-offscreen.directive";

@Component({
	imports: [PauseOffscreenDirective],
	template: `
		<div appPauseOffscreen></div>
	`
})
class HostComponent {}

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

describe("PauseOffscreenDirective", () => {
	let fixture: ComponentFixture<HostComponent>;
	let notifyIntersection: ObserverCallback;
	let disconnect: ReturnType<typeof vi.fn>;
	let observe: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		disconnect = vi.fn();
		observe = vi.fn();

		vi.stubGlobal(
			"IntersectionObserver",
			class {
				constructor(callback: ObserverCallback) {
					notifyIntersection = callback;
				}
				observe = observe;
				disconnect = disconnect;
				unobserve = vi.fn();
				takeRecords = vi.fn();
			}
		);

		await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		await fixture.whenStable();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	const host = () => fixture.debugElement.query(By.directive(PauseOffscreenDirective));

	it("observes the host element", () => {
		expect(observe).toHaveBeenCalledWith(host().nativeElement);
	});

	it("runs the animation while the element is on screen", () => {
		notifyIntersection([{ isIntersecting: true }]);

		expect(host().nativeElement.style.animationPlayState).toBe("running");
	});

	it("pauses the animation once the element leaves the screen", () => {
		notifyIntersection([{ isIntersecting: false }]);

		expect(host().nativeElement.style.animationPlayState).toBe("paused");
	});

	it("disconnects the observer when the host is destroyed", () => {
		fixture.destroy();

		expect(disconnect).toHaveBeenCalled();
	});
});
