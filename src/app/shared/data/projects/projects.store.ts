import { inject, Service } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs";
import { ProjectContent, ProjectDefinition } from "./projects.model";
import { PROJECTS_DEFINITIONS } from "./projects.data";

@Service()
export class ProjectsStore {
	private readonly imagesRoot = "projects";
	private readonly imageExtension = "jpg";

	private readonly translateService = inject(TranslateService);

	readonly items = toSignal(
		this.translateService
			.stream("projects.items")
			.pipe(
				map((items: unknown) => (Array.isArray(items) ? (items as ProjectContent[]) : []))
			),
		{ initialValue: [] as ProjectContent[] }
	);

	readonly definitions = PROJECTS_DEFINITIONS;

	byId(id: string): ProjectContent | undefined {
		return this.items().find((project) => project.id === id);
	}

	definitionOf(id: string): ProjectDefinition | undefined {
		return this.definitions[id];
	}

	hasDefinition(id: string): boolean {
		return id in this.definitions;
	}

	imagePath(id: string, image: number): string {
		return `${this.imagesRoot}/${id}/${image}.${this.imageExtension}`;
	}
}
