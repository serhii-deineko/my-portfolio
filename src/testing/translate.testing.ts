import { Provider } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideTranslateService, TranslateService } from "@ngx-translate/core";

export const TEST_LANGUAGE = "en";

type TestTranslations = Parameters<TranslateService["setTranslation"]>[1];

export function provideTranslateTesting(): Provider[] {
	return provideTranslateService({ lang: TEST_LANGUAGE, fallbackLang: TEST_LANGUAGE });
}

export function setTestTranslations(translations: TestTranslations): void {
	const translateService = TestBed.inject(TranslateService);
	translateService.setTranslation(TEST_LANGUAGE, translations);
	translateService.use(TEST_LANGUAGE);
}
