import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SECTION_BY_ID } from "../../core/sections";
import { ExperienceComponent } from "./experience/experience";
import { HeroComponent } from "./hero/hero";
import { ProjectsComponent } from "./projects/projects";

@Component({
	selector: "app-home",
	imports: [HeroComponent, ProjectsComponent, ExperienceComponent, TranslatePipe],
	template: `
		<main class="home" id="main-content" tabindex="-1">
			<section
				class="home__section home__section--hero"
				[attr.aria-label]="sections.hero.labelKey | translate"
				[id]="sections.hero.id">
				<app-hero />
			</section>

			<section
				class="home__section"
				[attr.aria-label]="sections.projects.labelKey | translate"
				[id]="sections.projects.id">
				<app-projects />
			</section>

			<section
				class="home__section"
				[attr.aria-label]="sections.experience.labelKey | translate"
				[id]="sections.experience.id">
				<app-experience />
			</section>
		</main>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: "./home.scss"
})
export class HomeComponent {
	protected readonly sections = SECTION_BY_ID;
}
