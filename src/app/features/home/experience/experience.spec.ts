import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
	provideTranslateTesting,
	setTestTranslations
} from "../../../../testing/translate.testing";
import { ExperienceComponent } from "./experience";

describe("ExperienceComponent", () => {
	let fixture: ComponentFixture<ExperienceComponent>;
	let component: ExperienceComponent;

	const host = (): HTMLElement => fixture.nativeElement;

	const isExpanded = (key: string): boolean => component["isExpanded"](key);
	const toggle = (key: string): void => component["toggle"](key);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ExperienceComponent],
			providers: [provideTranslateTesting()]
		}).compileComponents();

		setTestTranslations({
			experience: {
				title: "Experience",
				items: [
					{
						id: "yarrl",
						company: "Yarrl S.A.",
						duration: "2022 - now",
						role: "Frontend Developer",
						points: ["Built AI dashboards", "Led the design system"]
					},
					{
						id: "lark",
						company: "Lark Leisure Homes",
						duration: "2020 - 2022",
						role: "Fullstack Developer"
					}
				]
			}
		});

		fixture = TestBed.createComponent(ExperienceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("renders one entry per translated experience item", () => {
		const items = host().querySelectorAll(".experience__item");

		expect(items).toHaveLength(2);
	});

	it("renders the company and role of each entry", () => {
		const companies = Array.from(
			host().querySelectorAll<HTMLElement>(".experience__company")
		).map((element) => element.textContent?.trim());

		expect(companies).toEqual(["Yarrl S.A.", "Lark Leisure Homes"]);
	});

	it("heads the section with the translated title and the entry count", () => {
		const title = host().querySelector<HTMLElement>(".sub-header");
		const count = host().querySelector<HTMLElement>(".sub-header__count");

		expect(title?.textContent).toContain("Experience");
		expect(count?.textContent?.trim()).toBe("02");
	});

	it("collapses every entry by default", () => {
		expect(isExpanded("yarrl")).toBe(false);
	});

	it("expands and collapses an entry by key", () => {
		toggle("yarrl");
		expect(isExpanded("yarrl")).toBe(true);

		toggle("yarrl");
		expect(isExpanded("yarrl")).toBe(false);
	});

	it("tracks expanded entries independently", () => {
		toggle("yarrl");
		toggle("lark");
		toggle("yarrl");

		expect(isExpanded("yarrl")).toBe(false);
		expect(isExpanded("lark")).toBe(true);
	});
});
