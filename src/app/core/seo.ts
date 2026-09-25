import { DOCUMENT, inject, Service } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { Meta, Title } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { combineLatest, map } from "rxjs";
import { filter } from "rxjs/operators";
import { ProjectContent } from "../shared/data/projects/projects.model";
import { ProjectsStore } from "../shared/data/projects/projects.store";

export interface SeoData {
	title: string;
	description: string;
	keywords?: string;
	image?: string;
	imageWidth?: number;
	imageHeight?: number;
	imageAlt?: string;
	canonical: string;
	type?: string;
	indexable?: boolean;
}

@Service()
export class SeoService {
	private readonly meta = inject(Meta);
	private readonly title = inject(Title);
	private readonly router = inject(Router);
	private readonly document = inject(DOCUMENT);
	private readonly translateService = inject(TranslateService);
	private readonly projectsStore = inject(ProjectsStore);

	private readonly baseUrl = "https://serhii.com.pl";
	private readonly logoUrl = `${this.baseUrl}/logo.png`;
	private readonly logoWidth = 512;
	private readonly logoHeight = 169;
	private readonly projectImageWidth = 1800;
	private readonly projectImageHeight = 1200;
	private readonly authorName = "Serhii Deineko";
	private readonly siteName = "Serhii Deineko Portfolio";
	private readonly structuredDataElementId = "structured-data";
	private readonly descriptionMaxLength = 160;
	private readonly indexableRobots =
		"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
	private readonly nonIndexableRobots = "noindex, follow";

	constructor() {
		combineLatest([this.navigationUrl$(), toObservable(this.projectsStore.items)])
			.pipe(takeUntilDestroyed())
			.subscribe(([url, projects]) => this.apply(this.resolveSeoData(url, projects)));
	}

	private navigationUrl$() {
		return this.router.events.pipe(
			filter((event): event is NavigationEnd => event instanceof NavigationEnd),
			map((event) => event.urlAfterRedirects)
		);
	}

	private resolveSeoData(url: string, projects: ProjectContent[]): SeoData {
		const path = this.trimTrailingSlashes(url.split("#")[0].split("?")[0]);
		const projectId = this.extractProjectId(path);

		if (projectId !== null) {
			return this.projectSeoData(projectId, projects);
		}

		switch (path) {
			case "":
				return this.homeSeoData();

			case "/about":
				return {
					title: "About Serhii Deineko - Angular Frontend Developer",
					description:
						"Learn about Serhii Deineko's journey as an Angular Frontend Developer. 6+ years of experience in AI-powered applications, web development, and modern frontend solutions.",
					keywords:
						"about, Angular developer, experience, portfolio, frontend developer, AI applications",
					canonical: `${this.baseUrl}/`,
					...this.logoImage()
				};

			case "/project":
				return {
					title: "Projects - Serhii Deineko Portfolio",
					description:
						"Explore Serhii Deineko's portfolio of web applications and AI-powered solutions. Including AISEMA grant advisor, speech analysis platforms, mobile home configurators, and chatbot development.",
					keywords:
						"projects, portfolio, Angular applications, AI solutions, web development, mobile home configurator, speech analysis, chatbot",
					canonical: `${this.baseUrl}/`,
					...this.logoImage()
				};

			case "/experience":
				return {
					title: "Experience - Serhii Deineko Career",
					description:
						"Serhii Deineko's professional experience as Fullstack Developer at Networks.ua, Lark Leisure Homes, and Frontend Developer at Yarrl S.A. Specialized in Angular, AI applications, and modern web solutions.",
					keywords:
						"experience, career, Angular developer, fullstack developer, AI applications, Yarrl, Lark Leisure Homes, Networks.ua",
					canonical: `${this.baseUrl}/`,
					...this.logoImage()
				};

			case "/contact":
				return {
					title: "Contact Serhii Deineko - Angular Frontend Developer",
					description:
						"Get in touch with Serhii Deineko for Angular frontend development projects, AI application development, and modern web solutions. Available for freelance and full-time opportunities.",
					keywords:
						"contact, hire, Angular developer, frontend developer, AI applications, freelance, web development",
					canonical: `${this.baseUrl}/`,
					...this.logoImage()
				};

			default:
				return {
					...this.homeSeoData(),
					canonical: `${this.baseUrl}${path}`,
					indexable: false
				};
		}
	}

	private trimTrailingSlashes(path: string): string {
		let end = path.length;
		while (end > 0 && path.charAt(end - 1) === "/") {
			end--;
		}
		return path.slice(0, end);
	}

	private extractProjectId(path: string): string | null {
		const projectMatch = path.match(/^\/project\/([^/]+)$/);
		if (projectMatch) {
			return projectMatch[1];
		}

		const aliasMatch = path.match(/^\/([^/]+)$/);
		if (aliasMatch && this.projectsStore.hasDefinition(aliasMatch[1])) {
			return aliasMatch[1];
		}

		return null;
	}

	private homeSeoData(): SeoData {
		return {
			title: "Serhii Deineko - Angular Frontend Developer | AI & Web Solutions",
			description:
				"Angular Frontend Developer with 6+ years experience. Specialized in AI-powered applications, SPA development, and modern web solutions. Creator of AISEMA grant advisor, speech analysis platforms, and mobile home configurators.",
			keywords:
				"Angular developer, Frontend developer, AI applications, TypeScript, JavaScript, SPA development, Web solutions, Grant advisor, Speech analysis, Mobile home configurator, Chatbot development, Fullstack developer",
			canonical: `${this.baseUrl}/`,
			...this.logoImage()
		};
	}

	private projectSeoData(projectId: string, projects: ProjectContent[]): SeoData {
		const project = projects.find((item) => item.id === projectId);
		const definition = this.projectsStore.definitionOf(projectId);
		const canonical = `${this.baseUrl}/project/${projectId}`;

		if (!project || !definition) {
			return {
				title: `Project - ${this.siteName}`,
				description:
					"Experienced Angular Frontend Developer specializing in modern web applications.",
				canonical,
				indexable: false,
				...this.logoImage()
			};
		}

		return {
			title: `${project.title} - ${this.authorName}`,
			description: this.toDescription(project),
			keywords: definition.tech.join(", "),
			image: `${this.baseUrl}/${this.projectsStore.imagePath(projectId, 0)}`,
			imageWidth: this.projectImageWidth,
			imageHeight: this.projectImageHeight,
			imageAlt: project.title,
			canonical,
			type: "article"
		};
	}

	private logoImage() {
		return {
			image: this.logoUrl,
			imageWidth: this.logoWidth,
			imageHeight: this.logoHeight,
			imageAlt: `${this.authorName} - Angular Frontend Developer Portfolio`
		};
	}

	private toDescription(project: ProjectContent): string {
		const source = project.description ?? project["small-description"] ?? "";
		const plainText = source
			.replace(/<[^<>]*>/g, "")
			.replace(/\s+/g, " ")
			.trim();

		if (plainText.length <= this.descriptionMaxLength) {
			return plainText;
		}

		const truncated = plainText.slice(0, this.descriptionMaxLength);
		return `${truncated.slice(0, truncated.lastIndexOf(" "))}…`;
	}

	private apply(data: SeoData) {
		const image = data.image ?? this.logoUrl;
		const isIndexable = data.indexable !== false;
		const robots = isIndexable ? this.indexableRobots : this.nonIndexableRobots;

		this.title.setTitle(data.title);

		this.meta.updateTag({ name: "description", content: data.description });
		this.meta.updateTag({ name: "author", content: this.authorName });
		this.meta.updateTag({ name: "robots", content: robots });
		this.meta.updateTag({ name: "googlebot", content: robots });
		this.meta.updateTag({ name: "bingbot", content: robots });

		if (data.keywords) {
			this.meta.updateTag({ name: "keywords", content: data.keywords });
		} else {
			this.meta.removeTag('name="keywords"');
		}

		this.meta.updateTag({ property: "og:title", content: data.title });
		this.meta.updateTag({ property: "og:description", content: data.description });
		this.meta.updateTag({ property: "og:image", content: image });
		this.meta.updateTag({
			property: "og:image:width",
			content: String(data.imageWidth ?? this.logoWidth)
		});
		this.meta.updateTag({
			property: "og:image:height",
			content: String(data.imageHeight ?? this.logoHeight)
		});
		this.meta.updateTag({ property: "og:image:alt", content: data.imageAlt ?? data.title });
		this.meta.updateTag({ property: "og:url", content: data.canonical });
		this.meta.updateTag({ property: "og:type", content: data.type ?? "website" });
		this.meta.updateTag({ property: "og:site_name", content: this.siteName });

		this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" });
		this.meta.updateTag({ name: "twitter:title", content: data.title });
		this.meta.updateTag({ name: "twitter:description", content: data.description });
		this.meta.updateTag({ name: "twitter:image", content: image });
		this.meta.updateTag({ name: "twitter:image:alt", content: data.imageAlt ?? data.title });

		this.updateCanonicalUrl(data.canonical);
		this.setStructuredData(this.buildStructuredData(data, isIndexable));
	}

	private updateCanonicalUrl(url: string) {
		let canonicalLink: HTMLLinkElement | null =
			this.document.querySelector('link[rel="canonical"]');

		if (!canonicalLink) {
			canonicalLink = this.document.createElement("link");
			canonicalLink.setAttribute("rel", "canonical");
			this.document.head.appendChild(canonicalLink);
		}

		canonicalLink.setAttribute("href", url);
	}

	private setStructuredData(payload: unknown[]) {
		this.document.getElementById(this.structuredDataElementId)?.remove();

		if (payload.length === 0) {
			return;
		}

		const script = this.document.createElement("script");
		script.type = "application/ld+json";
		script.id = this.structuredDataElementId;
		script.textContent = JSON.stringify(payload).replace(/</g, "\\u003c");
		this.document.head.appendChild(script);
	}

	private buildStructuredData(data: SeoData, isIndexable: boolean): unknown[] {
		if (!isIndexable) {
			return [];
		}

		if (data.canonical === `${this.baseUrl}/`) {
			return this.homeStructuredData();
		}

		if (data.type === "article") {
			return this.projectStructuredData(data);
		}

		return [];
	}

	private projectStructuredData(data: SeoData): unknown[] {
		return [
			{
				"@context": "https://schema.org",
				"@type": "CreativeWork",
				"@id": `${data.canonical}#project`,
				name: data.imageAlt ?? data.title,
				headline: data.title,
				description: data.description,
				url: data.canonical,
				image: data.image,
				keywords: data.keywords,
				inLanguage: this.translateService.getCurrentLang() || "en",
				author: { "@id": `${this.baseUrl}/#person` },
				creator: { "@id": `${this.baseUrl}/#person` },
				isPartOf: { "@id": `${this.baseUrl}/#website` }
			},
			{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				"@id": `${data.canonical}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: `${this.baseUrl}/`
					},
					{
						"@type": "ListItem",
						position: 2,
						name: data.imageAlt ?? data.title,
						item: data.canonical
					}
				]
			}
		];
	}

	private homeStructuredData(): unknown[] {
		return [
			{
				"@context": "https://schema.org",
				"@type": "WebSite",
				"@id": `${this.baseUrl}/#website`,
				url: `${this.baseUrl}/`,
				name: this.siteName,
				description:
					"Angular Frontend Developer portfolio showcasing AI-powered applications and modern web solutions",
				inLanguage: this.translateService.getCurrentLang() || "en",
				publisher: { "@id": `${this.baseUrl}/#person` }
			},
			{
				"@context": "https://schema.org",
				"@type": "Person",
				"@id": `${this.baseUrl}/#person`,
				name: this.authorName,
				jobTitle: "Angular Frontend Developer",
				description:
					"Angular Frontend Developer with 6+ years experience specializing in AI-powered applications, SPA development, and modern web solutions",
				url: `${this.baseUrl}/`,
				image: this.logoUrl,
				sameAs: [
					"https://github.com/serhii-deineko",
					"https://www.linkedin.com/in/serhii-deineko"
				],
				knowsAbout: [
					"Angular",
					"TypeScript",
					"JavaScript",
					"AI Applications",
					"Web Development"
				],
				hasOccupation: {
					"@type": "Occupation",
					name: "Frontend Developer",
					occupationLocation: {
						"@type": "Country",
						name: "Poland"
					},
					skills: "Angular, TypeScript, AI Applications, Firebase, Docker, CI/CD"
				},
				alumniOf: [
					{
						"@type": "EducationalOrganization",
						name: "PSW w Białej Podlaskiej",
						location: "Poland"
					},
					{
						"@type": "EducationalOrganization",
						name: "Dnipro University of Technology",
						location: "Ukraine"
					}
				],
				worksFor: [
					{
						"@type": "Organization",
						name: "Yarrl S.A.",
						description: "Frontend Developer - AI Applications"
					},
					{
						"@type": "Organization",
						name: "Lark Leisure Homes",
						description: "Fullstack Developer - Web Solutions"
					}
				]
			},
			{
				"@context": "https://schema.org",
				"@type": "ProfilePage",
				"@id": `${this.baseUrl}/#profilepage`,
				url: `${this.baseUrl}/`,
				mainEntity: { "@id": `${this.baseUrl}/#person` },
				isPartOf: { "@id": `${this.baseUrl}/#website` }
			}
		];
	}
}
