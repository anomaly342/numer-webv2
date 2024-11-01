export interface RootResult {
	value: number;
	iterations: BisectionIteration[] | FixedPointIteration[];
}

export interface Iteration {
	error: number;
}

export interface BisectionIteration extends Iteration {
	xl: number;
	xr: number;
	t: number;
	ft: number;
}

export interface FixedPointIteration extends Iteration {
	x: number;
}

export type DataIteration = BisectionIteration[] | FixedPointIteration[];
