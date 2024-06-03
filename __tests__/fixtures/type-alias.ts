type AType = {
	z(): number;
	y: number;
	x: () => () => number;
	new (a: 0, b: 1): AType;
	get w(): number;
	v?(): number;
	[u: number]: () => number;
	[t: string]: unknown;
	[`s`]: number;
	r?: number;
}
