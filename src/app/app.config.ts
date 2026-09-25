import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withXhr } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeEn from "@angular/common/locales/en";
import localeFr from "@angular/common/locales/fr";
import localePl from "@angular/common/locales/pl";
import localeUk from "@angular/common/locales/uk";
import {
	ApplicationConfig,
	inject,
	provideAppInitializer,
	provideZonelessChangeDetection
} from "@angular/core";
import {
	provideClientHydration,
	withEventReplay,
	withNoIncrementalHydration
} from "@angular/platform-browser";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { provideTranslateLoader, provideTranslateService } from "@ngx-translate/core";
import { routes } from "./app.routes";
import { BrowserTranslateLoader } from "./core/i18n/browser-translate.loader";
import { SeoService } from "./core/seo";

registerLocaleData(localeEn, "en-US");
registerLocaleData(localePl, "pl-PL");
registerLocaleData(localeUk, "uk-UA");
registerLocaleData(localeFr, "fr-FR");
registerLocaleData(localeDe, "de-DE");

export const appConfig: ApplicationConfig = {
	providers: [
		provideZonelessChangeDetection(),
		provideTranslateService({
			fallbackLang: "en",
			lang: "en",
			loader: provideTranslateLoader(BrowserTranslateLoader)
		}),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: "top",
				anchorScrolling: "enabled"
			})
		),
		provideHttpClient(withXhr()),
		provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
		provideAppInitializer(() => void inject(SeoService))
	]
};
