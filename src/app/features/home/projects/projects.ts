import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslatePipe } from "@ngx-translate/core";
import { ProjectContent } from "../../../shared/data/projects/projects.model";
import { ProjectsStore } from "../../../shared/data/projects/projects.store";
import { CtaButtonComponent } from "../../../shared/ui/cta-button/cta-button";
import { SubHeaderComponent } from "../../../shared/ui/sub-header/sub-header";

interface ProjectCard extends ProjectContent {
	tech: string[];
	image: string;
}

@Component({
	selector: "app-projects",
	imports: [MatIconModule, TranslatePipe, CtaButtonComponent, SubHeaderComponent],
	templateUrl: "./projects.html",
	styleUrl: "./projects.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
	private readonly maxVisibleTech = 7;

	private readonly projectsStore = inject(ProjectsStore);

	protected readonly cards = computed<ProjectCard[]>(() =>
		this.projectsStore.items().map((project) => ({
			...project,
			tech:
				this.projectsStore.definitionOf(project.id)?.tech.slice(0, this.maxVisibleTech) ??
				[],
			image: this.projectsStore.imagePath(project.id, 0)
		}))
	);
}
