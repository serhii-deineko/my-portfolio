import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ThemeService } from "../../../core/theme";

@Component({
	selector: "app-theme-switcher",
	imports: [TranslatePipe],
	templateUrl: "./theme-switcher.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: "./theme-switcher.scss"
})
export class ThemeSwitcherComponent {
	protected readonly theme = inject(ThemeService);
}
