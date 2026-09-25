import { HttpClient } from "@angular/common/http";
import { inject, Service, TransferState } from "@angular/core";
import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { version } from "../../../../package.json";
import { translationStateKey } from "./translation-state-key";

@Service()
export class BrowserTranslateLoader extends TranslateLoader {
	private readonly http = inject(HttpClient);
	private readonly transferState = inject(TransferState);

	getTranslation(language: string): Observable<TranslationObject> {
		const stateKey = translationStateKey(language);
		const transferred = this.transferState.get(stateKey, null);

		if (transferred) {
			this.transferState.remove(stateKey);
			return of(transferred);
		}

		return this.http.get<TranslationObject>(`./assets/i18n/${language}.json?v=${version}`);
	}
}
