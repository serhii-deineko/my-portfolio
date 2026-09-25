export interface ProjectDemo {
	label?: string;
	type: string;
	url: string;
}

export interface ProjectKeyPoint {
	title?: string;
	description: string;
}

export interface ProjectContent {
	id: string;
	title: string;
	description?: string;
	"small-description"?: string;
	"key-points"?: (string | ProjectKeyPoint)[];
}

export interface ProjectDefinition {
	tech: string[];
	demo: ProjectDemo[];
	github: string;
	images: number | null;
}
