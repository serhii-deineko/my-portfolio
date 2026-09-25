import { inject, Service, TransferState } from "@angular/core";
import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import de from "../../../assets/i18n/de.json";
import en from "../../../assets/i18n/en.json";
import fr from "../../../assets/i18n/fr.json";
import pl from "../../../assets/i18n/pl.json";
import ua from "../../../assets/i18n/ua.json";
import { DEFAULT_LANGUAGE } from "./languages.constants";
import { translationStateKey } from "./translation-state-key";

const BUNDLED_TRANSLATIONS = {
	en,
	pl,
	ua,
	fr,
	de
} as unknown as Record<string, TranslationObject>;

@Service()
export class ServerTranslateLoader extends TranslateLoader {
	private readonly transferState = inject(TransferState);

	getTranslation(language: string): Observable<TranslationObject> {
		const translations =
			BUNDLED_TRANSLATIONS[language] ?? BUNDLED_TRANSLATIONS[DEFAULT_LANGUAGE];

		this.transferState.set(translationStateKey(language), translations);

		return of(translations);
	}
}
