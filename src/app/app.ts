import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "./core/language";
import { PageLoadingService } from "./core/page-loading";
import { ScrollService } from "./core/scroll";
import { SECTION_BY_ID, SECTION_IDS } from "./core/sections";
import { ThemeService } from "./core/theme";
import { AppContactComponent } from "./layout/app-contact/app-contact";
import { AppHeaderComponent } from "./layout/app-header/app-header";
import { AppFooterComponent } from "./layout/app-footer/app-footer";

@Component({
	selector: "app-root",
	imports: [
		AppHeaderComponent,
		RouterOutlet,
		AppContactComponent,
		AppFooterComponent,
		MatProgressSpinnerModule,
		TranslatePipe
	],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	private readonly destroyRef = inject(DestroyRef);
	private readonly scrollService = inject(ScrollService);
	private readonly languageService = inject(LanguageService);
	private readonly router = inject(Router);
	protected readonly pageLoading = inject(PageLoadingService);

	private readonly theme = inject(ThemeService);

	private readonly domSettleDelayMs = 100;
	private readonly scrollReinitializeDelayMs = 200;
	private readonly scrollProgressElementClass = "app__progress";

	private readonly sectionIds = SECTION_IDS;

	protected readonly contactSection = SECTION_BY_ID.contact;

	private previousUrl = "";

	ngOnInit() {
		this.pageLoading.addDependency("language");
		this.languageService
			.initLanguage()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => this.pageLoading.resolveDependency("language"),
				error: () => this.pageLoading.resolveDependency("language")
			});

		this.previousUrl = this.router.url;

		this.scrollService.init(this.sectionIds, this.scrollProgressElementClass);

		this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.handleNavigationStart(event);
			} else if (event instanceof NavigationEnd) {
				this.handleNavigationEnd(event);
			}
		});
	}

	private handleNavigationStart(event: NavigationStart) {
		if (this.isPageChange(event.url)) {
			this.pageLoading.start();
		}
	}

	private handleNavigationEnd(event: NavigationEnd) {
		const currentUrl = event.urlAfterRedirects;

		setTimeout(() => this.refreshSectionsForUrl(currentUrl), this.domSettleDelayMs);
		this.previousUrl = currentUrl;
	}

	private isPageChange(currentUrl: string): boolean {
		const currentBaseUrl = currentUrl.split("#")[0];
		const previousBaseUrl = this.previousUrl.split("#")[0];
		return currentBaseUrl !== previousBaseUrl;
	}

	private refreshSectionsForUrl(currentUrl: string) {
		const isHomePage = currentUrl === "/" || currentUrl.includes("#");

		if (isHomePage) {
			this.scrollService.updateSections(this.sectionIds);

			if (currentUrl === "/") {
				setTimeout(
					() => this.scrollService.init(this.sectionIds, this.scrollProgressElementClass),
					this.scrollReinitializeDelayMs
				);
			}
		} else {
			this.scrollService.clearActiveSection();
			this.scrollService.updateSections([]);
		}

		const anchor = currentUrl.split("#")[1];
		if (anchor) {
			setTimeout(() => this.scrollService.scrollTo(anchor), this.scrollReinitializeDelayMs);
		}
	}
}
