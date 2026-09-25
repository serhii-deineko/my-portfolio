import { Directive, computed, input } from "@angular/core";

@Directive({
	selector: "a[appExternalLink]",
	host: {
		"[attr.target]": "isExternal() ? '_blank' : null",
		"[attr.rel]": "isExternal() ? 'noopener noreferrer' : null"
	}
})
export class ExternalLinkDirective {
	readonly href = input<string | undefined | null>("", { alias: "appExternalLink" });

	protected readonly isExternal = computed(() => /^https?:\/\//i.test(this.href() ?? ""));
}
