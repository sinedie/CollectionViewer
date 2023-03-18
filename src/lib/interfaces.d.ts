interface Doc {
	name?: string;
	status?: string;
}

interface Collection {
	name?: string;
	children?: Doc[];
}
