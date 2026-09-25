import { TestBed } from "@angular/core/testing";
import { StorageService } from "./storage";

describe("StorageService", () => {
	let service: StorageService;

	beforeEach(() => {
		localStorage.clear();
		TestBed.configureTestingModule({});
		service = TestBed.inject(StorageService);
	});

	it("returns null for a key that was never stored", () => {
		expect(service.getItem("missing")).toBeNull();
	});

	it("stores and reads a value back", () => {
		service.setItem("theme", "dark");

		expect(service.getItem("theme")).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
	});

	it("removes a single key without touching the others", () => {
		service.setItem("theme", "dark");
		service.setItem("language", "pl");

		service.removeItem("theme");

		expect(service.getItem("theme")).toBeNull();
		expect(service.getItem("language")).toBe("pl");
	});

	it("clears every stored key", () => {
		service.setItem("theme", "dark");
		service.setItem("language", "pl");

		service.clear();

		expect(service.getItem("theme")).toBeNull();
		expect(service.getItem("language")).toBeNull();
	});

	it("treats an empty string as an absent value", () => {
		service.setItem("theme", "");

		expect(service.getItem("theme")).toBeNull();
	});
});
