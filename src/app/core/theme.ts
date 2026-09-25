import { DOCUMENT, effect, inject, Service, signal } from "@angular/core";
import { StorageService } from "./storage";

@Service()
export class ThemeService {
	private readonly document = inject(DOCUMENT);
	private readonly storageService = inject(StorageService);

	private readonly themeStorageKey = "theme";
	private readonly darkModeClass = "dark-mode";
	private readonly lightModeClass = "light-mode";
	private readonly lightThemeValue = "light";
	private readonly darkThemeValue = "dark";

	readonly isDark = signal(true);

	constructor() {
		this.initTheme();

		this.applyToBody(this.isDark());
		effect(() => this.applyToBody(this.isDark()));
	}

	toggle(): void {
		this.isDark.update((isDark) => !isDark);
		this.storageService.setItem(
			this.themeStorageKey,
			this.isDark() ? this.darkThemeValue : this.lightThemeValue
		);
	}

	private initTheme(): void {
		const storedTheme = this.storageService.getItem(this.themeStorageKey);

		if (storedTheme) {
			this.isDark.set(storedTheme !== this.lightThemeValue);
			return;
		}

		const window = this.document.defaultView;
		if (!window || !window.matchMedia) {
			this.isDark.set(true);
			return;
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		this.isDark.set(mediaQuery.matches);

		mediaQuery.addEventListener("change", (e) => {
			if (!this.storageService.getItem(this.themeStorageKey)) {
				this.isDark.set(e.matches);
			}
		});
	}

	private applyToBody(isDark: boolean): void {
		const body = this.document.body;

		if (!body) {
			return;
		}

		body.classList.toggle(this.darkModeClass, isDark);
		body.classList.toggle(this.lightModeClass, !isDark);
	}
}
