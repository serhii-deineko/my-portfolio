import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { TranslatePipe } from "@ngx-translate/core";
import {
	AVAILABLE_LANGUAGES,
	LANGUAGE_FLAGS,
	LANGUAGE_FULL_NAMES,
	Language
} from "../../../core/i18n/languages.constants";
import { LanguageService } from "../../../core/language";

@Component({
	selector: "app-language-switcher",
	imports: [MatMenuModule, MatRippleModule, TranslatePipe],
	templateUrl: "./language-switcher.html",
	styleUrl: "./language-switcher.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
	protected readonly languageService = inject(LanguageService);

	protected readonly languageFlags = LANGUAGE_FLAGS;
	protected readonly languageFullNames = LANGUAGE_FULL_NAMES;
	protected readonly availableLanguages = AVAILABLE_LANGUAGES;

	protected setLanguage(language: Language) {
		this.languageService.setLanguage(language);
	}
}
