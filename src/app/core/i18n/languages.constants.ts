export type Language = "en" | "pl" | "ua" | "fr" | "de";

export const DEFAULT_LANGUAGE: Language = "en";
export const AVAILABLE_LANGUAGES: Language[] = ["en", "pl", "ua", "fr", "de"];

export const LOCALES: Record<Language, string> = {
	en: "en_US",
	pl: "pl_PL",
	ua: "uk_UA",
	fr: "fr_FR",
	de: "de_DE"
};

export const LANGUAGE_FULL_NAMES: Record<Language, string> = {
	en: "English",
	pl: "Polish",
	ua: "Ukrainian",
	fr: "French",
	de: "German"
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
	en: "🇬🇧",
	pl: "🇵🇱",
	ua: "🇺🇦",
	fr: "🇫🇷",
	de: "🇩🇪"
};
