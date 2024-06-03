type Link = {
	foo: () => void;
	text: string;
	onClick: () => void;
};

type Literal = {
	method(): void;
	func: () => void;
	value: number;
}

interface Interface {
	method(): void;
	func: () => void;
	value: number;
}
