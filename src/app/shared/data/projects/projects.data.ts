import { ProjectDefinition } from "./projects.model";

export const PROJECTS_DEFINITIONS: Record<string, ProjectDefinition> = {
	"aisema-ai-grant-advisor": {
		tech: [
			"Vue 3",
			"Vue Router 4",
			"Pinia",
			"PrimeVue 3",
			"Tailwind CSS",
			"ApexCharts",
			"VeeValidate",
			"Axios + JWT",
			"Sentry",
			"Webpack (Vue CLI 5)"
		],
		demo: [
			{
				label: "Zobacz projekt",
				type: "www",
				url: "https://aisema.eu"
			},
			{
				label: "Przeczytaj artykuł w „Rzeczpospolitej”",
				type: "www",
				url: "https://cyfrowa.rp.pl/biznes-ludzie-startupy/art42365771-polska-aplikacja-ai-pomoze-firmom-zdobyc-pieniadze-z-ue"
			}
		],
		github: "",
		images: 4
	},
	"website-chatbot-plugin": {
		tech: [
			"Vanilla JavaScript",
			"Shadow DOM",
			"CSS Houdini",
			"Webpack 5",
			"PostCSS + cssnano",
			"Long-polling REST",
			"ClientJS"
		],
		demo: [],
		github: "",
		images: 2
	},
	"speech-analysis-platform": {
		tech: [
			"Angular 20",
			"Signals",
			"RxJS",
			"Angular Material",
			"MSAL / Microsoft Entra ID",
			"ApexCharts",
			"ECharts",
			"Tailwind CSS",
			"ngx-translate",
			"jsPDF",
			"Docker + Nginx"
		],
		demo: [],
		github: "",
		images: 4
	},
	"banking-genesys-cloud": {
		tech: ["Angular", "Genesys Cloud"],
		demo: [],
		github: "",
		images: null
	},
	"logistics-genesys-cloud": {
		tech: [
			"Angular 21",
			"Signals",
			"RxJS",
			"PrimeNG 21",
			"OAuth2 PKCE",
			"Genesys Cloud API",
			"ngx-translate",
			"Vitest",
			"Docker + Nginx",
			"Bitbucket Pipelines",
			"AWS ECR / ECS"
		],
		demo: [],
		github: "",
		images: 3
	},
	"logistics-widget-callback": {
		tech: [
			"Angular 21",
			"Angular Elements",
			"Shadow DOM",
			"Reactive Forms",
			"ngx-translate",
			"Vitest",
			"Docker + Nginx",
			"Bitbucket Pipelines",
			"AWS ECR / ECS"
		],
		demo: [],
		github: "",
		images: 3
	},
	"mobile-homes-order-app": {
		tech: [
			"Angular 18",
			"Angular Material",
			"RxJS",
			"Firebase (Auth, Firestore, Storage)",
			"Cloud Functions (Node 22)",
			"Nodemailer + Handlebars",
			"ngx-translate-router",
			"html2pdf.js + PDF.js",
			"Tailwind CSS"
		],
		demo: [],
		github: "",
		images: 4
	},
	"mobile-homes-configurator": {
		tech: [
			"Vanilla JavaScript",
			"HTML5 Canvas",
			"PHP",
			"MySQL",
			"WordPress",
			"DeepL API",
			"html2canvas + html2pdf.js",
			"Sharp (AVIF/WebP)"
		],
		demo: [{ type: "www", url: "https://larkfactory.com/configurator/?code=0" }],
		github: "",
		images: 4
	},
	"homes-offers-configurator": {
		tech: [
			"Vanilla JavaScript",
			"jQuery",
			"Cropper.js",
			"html2pdf.js (jsPDF)",
			"PDF.js",
			"node-vibrant",
			"OpenAI GPT-3.5 Turbo",
			"DeepL API",
			"PHP",
			"MySQL",
			"WordPress"
		],
		demo: [{ type: "pdf", url: "https://larkfactory.com/oferter/" }],
		github: "",
		images: 3
	},
	"lark-service-app": {
		tech: [
			"Angular 18",
			"Angular Material",
			"RxJS",
			"Firebase (Auth, Firestore, Storage)",
			"Cloud Functions (Node 22)",
			"Google Gemini 2.5 Flash",
			"Nodemailer + Handlebars",
			"ngx-translate",
			"html2pdf.js"
		],
		demo: [],
		github: "",
		images: 3
	},
	"lead-management-system": {
		tech: ["Google Apps Script", "Google Sheets API"],
		demo: [],
		github: "",
		images: null
	}
};
