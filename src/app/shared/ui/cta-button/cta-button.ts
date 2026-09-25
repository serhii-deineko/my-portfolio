import { NgTemplateOutlet } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	input,
	signal
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ExternalLinkDirective } from "../../directives/external-link.directive";

type DownloadPhase = "idle" | "loading" | "done" | "error";

@Component({
	selector: "app-cta-button",
	imports: [
		NgTemplateOutlet,
		MatIconModule,
		MatProgressSpinnerModule,
		RouterLink,
		ExternalLinkDirective,
		TranslatePipe
	],
	templateUrl: "./cta-button.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: "./cta-button.scss"
})
export class CtaButtonComponent {
	private readonly destroyRef = inject(DestroyRef);

	readonly buttonText = input.required<string>();
	readonly targetUrl = input<string>();
	readonly fileUrl = input<string>();

	readonly fileName = input<string>();

	readonly buttonIcon = input<string>();
	readonly routerLink = input<string | (string | number)[]>();
	readonly ariaLabel = input<string>();

	private readonly spinnerDelayMs = 150;
	private readonly spinnerMinVisibleMs = 500;
	private readonly resultVisibleMs = 1600;

	protected readonly spinnerDiameter = 22;
	protected readonly spinnerStrokeWidth = 2.5;

	private readonly phase = signal<DownloadPhase>("idle");
	private readonly timers = new Set<ReturnType<typeof setTimeout>>();

	private runId = 0;

	protected readonly spinnerVisible = signal(false);

	protected readonly downloadName = computed<string | null>(() =>
		!this.targetUrl() && this.fileUrl() ? (this.fileName() ?? "") : null
	);

	protected readonly isBusy = computed(() => this.phase() === "loading");

	protected readonly icon = computed(() => {
		switch (this.phase()) {
			case "done":
				return "check";
			case "error":
				return "error_outline";
			default:
				return this.buttonIcon();
		}
	});

	protected readonly statusKey = computed(() => {
		switch (this.phase()) {
			case "loading":
				return "uni.downloading";
			case "done":
				return "uni.downloaded";
			case "error":
				return "uni.download-failed";
			default:
				return "";
		}
	});

	constructor() {
		this.destroyRef.onDestroy(() => {
			this.timers.forEach((timer) => clearTimeout(timer));
			this.timers.clear();
		});
	}

	protected onClick(event: MouseEvent): void {
		const url = this.fileUrl();

		if (!url || this.targetUrl() || this.routerLink()) {
			return;
		}

		if (
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		) {
			return;
		}

		event.preventDefault();

		if (this.isBusy()) {
			return;
		}

		void this.download(url);
	}

	private async download(url: string): Promise<void> {
		const runId = ++this.runId;
		const startedAt = Date.now();

		this.phase.set("loading");
		const reveal = this.schedule(() => this.spinnerVisible.set(true), this.spinnerDelayMs);

		const blob = await this.fetchFile(url);

		this.cancel(reveal);
		if (runId !== this.runId) {
			return;
		}

		if (this.spinnerVisible()) {
			const shownFor = Date.now() - startedAt - this.spinnerDelayMs;
			await this.wait(this.spinnerMinVisibleMs - shownFor);

			if (runId !== this.runId) {
				return;
			}
		}

		this.spinnerVisible.set(false);
		this.save(url, blob);
		this.phase.set(blob ? "done" : "error");

		await this.wait(this.resultVisibleMs);
		if (runId === this.runId) {
			this.phase.set("idle");
		}
	}

	private async fetchFile(url: string): Promise<Blob | null> {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				return null;
			}
			const blob = await response.blob();
			return new Blob([blob], { type: "application/octet-stream" });
		} catch {
			return null;
		}
	}

	private save(url: string, blob: Blob | null): void {
		if (!blob) {
			this.saveAs(url, this.suggestedName(url));
			return;
		}

		const objectUrl = URL.createObjectURL(blob);
		this.saveAs(objectUrl, this.suggestedName(url));

		this.schedule(() => URL.revokeObjectURL(objectUrl), 0);
	}

	private saveAs(href: string, name: string): void {
		const link = document.createElement("a");
		link.href = href;
		link.download = name;
		link.rel = "noopener";

		document.body.appendChild(link);
		link.click();
		link.remove();
	}

	private suggestedName(url: string): string {
		const configured = this.fileName();
		if (configured) {
			return configured;
		}

		const lastSegment = url.split(/[?#]/)[0].split("/").pop() ?? "";
		return decodeURIComponent(lastSegment);
	}

	private schedule(action: () => void, delayMs: number): ReturnType<typeof setTimeout> {
		const timer = setTimeout(() => {
			this.timers.delete(timer);
			action();
		}, delayMs);

		this.timers.add(timer);
		return timer;
	}

	private cancel(timer: ReturnType<typeof setTimeout>): void {
		clearTimeout(timer);
		this.timers.delete(timer);
	}

	private wait(delayMs: number): Promise<void> {
		if (delayMs <= 0) {
			return Promise.resolve();
		}

		return new Promise((resolve) => this.schedule(resolve, delayMs));
	}
}
