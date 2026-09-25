import { CdkTrapFocus } from "@angular/cdk/a11y";
import { ScrollStrategyOptions } from "@angular/cdk/overlay";
import { NgTemplateOutlet } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { PageLoadingService } from "../../core/page-loading";
import { CtaButtonComponent } from "../../shared/ui/cta-button/cta-button";
import { ExternalLinkDirective } from "../../shared/directives/external-link.directive";
import { HeroImageDirective } from "../../shared/directives/hero-image.directive";
import { PauseOffscreenDirective } from "../../shared/directives/pause-offscreen.directive";
import { SubHeaderComponent } from "../../shared/ui/sub-header/sub-header";
import { SocialIconComponent } from "../../shared/ui/social-icon/social-icon";
import {
	ProjectContent,
	ProjectDefinition,
	ProjectKeyPoint
} from "../../shared/data/projects/projects.model";
import { ProjectsStore } from "../../shared/data/projects/projects.store";

interface NavRow {
	id: string;
	title: string;
	index: string;
	tech: string;
}

interface Screenshot {
	number: number;
	src: string;
}

interface CaseRow {
	index: string;
	title?: string;
	description: string;
	screen: Screenshot | null;
}

@Component({
	selector: "app-project",
	imports: [
		NgTemplateOutlet,
		SocialIconComponent,
		CtaButtonComponent,
		TranslatePipe,
		MatIconModule,
		ExternalLinkDirective,
		HeroImageDirective,
		PauseOffscreenDirective,
		CdkTrapFocus,
		RouterLink,
		SubHeaderComponent
	],
	templateUrl: "./project.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: "./project.scss",
	host: {
		"(document:keydown.escape)": "onEscape()"
	}
})
export class ProjectComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly projectsStore = inject(ProjectsStore);
	private readonly pageLoading = inject(PageLoadingService);
	private readonly destroyRef = inject(DestroyRef);
	private readonly modalScrollStrategy = inject(ScrollStrategyOptions).block();

	private readonly projectId = signal<string>("");
	private readonly selectedImage = signal<number | undefined>(undefined);

	protected readonly heroImageBroken = signal<boolean>(false);

	protected readonly projectDefinition = computed<ProjectDefinition | undefined>(() =>
		this.projectsStore.definitionOf(this.projectId())
	);
	protected readonly currentProject = computed<ProjectContent | undefined>(() =>
		this.projectsStore.byId(this.projectId())
	);

	protected readonly heroImage = computed<string>(() => this.imagePath(0));

	private readonly points = computed<ProjectKeyPoint[]>(() =>
		(this.currentProject()?.["key-points"] ?? []).map((point) =>
			typeof point === "string" ? { description: point } : point
		)
	);

	private readonly screens = computed<Screenshot[]>(() =>
		Array.from({ length: this.projectDefinition()?.images ?? 0 }, (_, index) => ({
			number: index + 1,
			src: this.imagePath(index + 1)
		}))
	);

	protected readonly cases = computed<CaseRow[]>(() => {
		const screens = this.screens();
		return this.points().map((point, index) => ({
			index: this.padNumber(index + 1),
			title: point.title,
			description: point.description,
			screen: screens[index] ?? null
		}));
	});

	protected readonly extraScreens = computed<Screenshot[]>(() =>
		this.screens().slice(this.points().length)
	);

	protected readonly selectedImageSrc = computed<string | null>(() => {
		const image = this.selectedImage();
		return image === undefined ? null : this.imagePath(image);
	});

	protected readonly projectNumber = computed<string>(() => {
		const index = this.indexOfCurrentProject(this.projectsStore.items());
		return index < 0 ? "" : this.padNumber(index + 1);
	});

	protected readonly projectTotal = computed<string>(() => {
		const items = this.projectsStore.items();
		return this.indexOfCurrentProject(items) < 0 ? "" : this.padNumber(items.length);
	});

	protected readonly otherProjects = computed<NavRow[]>(() =>
		this.projectsStore
			.items()
			.map((item, index) => ({
				id: item.id,
				title: item.title,
				index: this.padNumber(index + 1),
				tech: this.projectsStore.definitionOf(item.id)?.tech?.[0] ?? ""
			}))
			.filter((item) => item.id !== this.projectId())
	);

	constructor() {
		this.destroyRef.onDestroy(() => this.modalScrollStrategy.disable());

		this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
			const id = params.get("id");
			if (!id) {
				this.router.navigate(["/"]);
				return;
			}
			if (this.selectedImage() !== undefined) {
				this.closeFullscreen();
			}
			if (this.projectId() && this.projectId() !== id) {
				this.pageLoading.start();
			}
			this.projectId.set(id);
			this.heroImageBroken.set(false);
		});
	}

	protected onHeroImageError(): void {
		this.heroImageBroken.set(true);
	}

	protected openFullscreen(imageNumber: number): void {
		this.selectedImage.set(imageNumber);
		this.modalScrollStrategy.enable();
	}

	protected closeFullscreen(): void {
		this.selectedImage.set(undefined);
		this.modalScrollStrategy.disable();
	}

	protected onBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			this.closeFullscreen();
		}
	}

	protected onEscape(): void {
		if (this.selectedImage() !== undefined) {
			this.closeFullscreen();
		}
	}

	private imagePath(image: number): string {
		return this.projectsStore.imagePath(this.projectId(), image);
	}

	private padNumber(value: number): string {
		return value.toString().padStart(2, "0");
	}

	private indexOfCurrentProject(items: readonly ProjectContent[]): number {
		return items.findIndex((project) => project.id === this.projectId());
	}
}
