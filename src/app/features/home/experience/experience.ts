import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ExternalLinkDirective } from "../../../shared/directives/external-link.directive";
import { SubHeaderComponent } from "../../../shared/ui/sub-header/sub-header";

@Component({
	selector: "app-experience",
	imports: [NgTemplateOutlet, TranslatePipe, SubHeaderComponent, ExternalLinkDirective],
	templateUrl: "./experience.html",
	styleUrl: "./experience.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceComponent {
	private readonly expanded = signal<ReadonlySet<string>>(new Set());

	protected isExpanded(key: string): boolean {
		return this.expanded().has(key);
	}

	protected toggle(key: string): void {
		this.expanded.update((keys) => {
			const next = new Set(keys);
			if (!next.delete(key)) {
				next.add(key);
			}
			return next;
		});
	}
}
