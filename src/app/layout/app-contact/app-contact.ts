import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SocialIconComponent } from "../../shared/ui/social-icon/social-icon";
import { CONTACT_CHANNELS } from "../layout.constants";
import { ExternalLinkDirective } from "../../shared/directives/external-link.directive";

@Component({
	selector: "app-contact",
	imports: [TranslatePipe, ExternalLinkDirective, SocialIconComponent],
	templateUrl: "./app-contact.html",
	styleUrl: "./app-contact.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppContactComponent {
	protected readonly channels = CONTACT_CHANNELS;
	protected readonly currentYear = new Date().getFullYear();
}
