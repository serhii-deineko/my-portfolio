import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

@Component({
	selector: "app-sub-header",
	templateUrl: "./sub-header.html",
	styleUrl: "./sub-header.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubHeaderComponent {
	readonly count = input<unknown>();
	readonly headingId = input<string>();

	protected readonly countLabel = computed<string>(() => {
		const value = this.count();
		const total = Array.isArray(value) ? value.length : value;
		return typeof total === "number" ? total.toString().padStart(2, "0") : "";
	});
}
