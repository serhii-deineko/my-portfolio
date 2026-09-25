import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export type SocialIconName = "gmail" | "telegram" | "whatsapp" | "linkedin" | "github";

@Component({
	selector: "app-social-icon",
	template: "",
	styleUrl: "./social-icon.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"[class]": "'social-icon social-icon--' + name()",
		"[style.--social-icon-size]": "size()",
		"aria-hidden": "true"
	}
})
export class SocialIconComponent {
	readonly name = input.required<SocialIconName>();

	readonly size = input<string>();
}
