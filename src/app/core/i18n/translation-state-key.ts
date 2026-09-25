import { makeStateKey, StateKey } from "@angular/core";
import { TranslationObject } from "@ngx-translate/core";

export function translationStateKey(language: string): StateKey<TranslationObject> {
	return makeStateKey<TranslationObject>(`i18n.${language}`);
}
