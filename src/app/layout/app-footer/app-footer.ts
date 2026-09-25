import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ScrollService } from "../../core/scroll";
import { SocialIconComponent } from "../../shared/ui/social-icon/social-icon";
import { CONTACT_CHANNELS } from "../layout.constants";
import { ExternalLinkDirective } from "../../shared/directives/external-link.directive";

@Component({
	selector: "app-footer",
	imports: [ExternalLinkDirective, SocialIconComponent],
	templateUrl: "./app-footer.html",
	styleUrl: "./app-footer.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFooterComponent {
	private readonly nearTopThreshold = 150;

	private readonly scrollService = inject(ScrollService);

	protected readonly channels = CONTACT_CHANNELS;

	protected readonly isHidden = computed(
		() =>
			this.scrollService.isContactVisible() ||
			this.scrollService.scrollPosition() < this.nearTopThreshold
	);
}
