import { DOCUMENT, inject, Service, signal } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import {
	AVAILABLE_LANGUAGES,
	DEFAULT_LANGUAGE,
	Language,
	LOCALES
} from "./i18n/languages.constants";
import { StorageService } from "./storage";

@Service()
export class LanguageService {
	private readonly document = inject(DOCUMENT);
	private readonly translateService = inject(TranslateService);
	private readonly meta = inject(Meta);
	private readonly storageService = inject(StorageService);

	private readonly languageStorageKey = "language";
	private readonly fallbackLanguage: Language = "en";

	readonly language = signal<Language>(DEFAULT_LANGUAGE);

	initLanguage() {
		const storedLanguage = this.storageService.getItem(this.languageStorageKey) as Language;
		const browserLanguage = this.getBrowserLanguage();

		const resolvedLanguage =
			storedLanguage ||
			browserLanguage ||
			this.translateService.getCurrentLang() ||
			this.translateService.getFallbackLang() ||
			this.fallbackLanguage;

		return this.setLanguage(resolvedLanguage as Language);
	}

	setLanguage(language: Language) {
		const translationsLoaded$ = this.translateService.use(language);
		this.setDocumentLanguage(language);
		this.updateOpenGraphLocaleTags(language);
		this.language.set(language);
		this.storageService.setItem(this.languageStorageKey, language);
		return translationsLoaded$;
	}

	private getBrowserLanguage(): Language | null {
		const window = this.document.defaultView;
		if (!window || !window.navigator) {
			return null;
		}

		const navigator = window.navigator;
		const browserLangs = navigator.languages || [navigator.language];

		for (const lang of browserLangs) {
			if (!lang) continue;
			const shortLang = lang.split("-")[0].toLowerCase() as Language;
			if (AVAILABLE_LANGUAGES.includes(shortLang)) {
				return shortLang;
			}
		}

		return null;
	}

	private setDocumentLanguage(language: Language): void {
		if (this.document?.documentElement) {
			this.document.documentElement.lang = language;
		}
	}

	private updateOpenGraphLocaleTags(language: Language): void {
		this.meta.removeTag(`content='${this.getLocale(language)}'`);
		this.meta.updateTag({ property: "og:locale", content: this.getLocale(language) });
		this.meta.addTags(
			AVAILABLE_LANGUAGES.filter((available) => available !== language).map((alternate) => ({
				property: "og:locale:alternate",
				content: this.getLocale(alternate)
			}))
		);
	}

	private getLocale(language: Language): string {
		return LOCALES[language];
	}
}
