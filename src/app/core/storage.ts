import { Service, DOCUMENT, inject } from "@angular/core";

@Service()
export class StorageService {
	private readonly document = inject(DOCUMENT);

	private readonly isBrowser: boolean;

	constructor() {
		this.isBrowser =
			typeof this.document !== "undefined" &&
			typeof this.document.defaultView !== "undefined";
	}

	getItem(key: string): string | null {
		return this.browserStorage?.getItem(key) || null;
	}

	setItem(key: string, value: string): void {
		this.browserStorage?.setItem(key, value);
	}

	removeItem(key: string): void {
		this.browserStorage?.removeItem(key);
	}

	clear(): void {
		this.browserStorage?.clear();
	}

	private get browserStorage(): Storage | null {
		if (!this.isBrowser) {
			return null;
		}
		return this.document.defaultView?.localStorage ?? null;
	}
}
