export interface RootRequest {
	expression: string;
	error: number;
}

export interface BisectionRequest extends RootRequest {
	start: number;
	end: number;
}

export interface FixedPointRequest extends RootRequest {
	start: number;
}

export interface SecantRequest extends RootRequest {
	start_0: number;
	start_1: number;
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

export interface Result {
	value: number;
	iterations: BisectionIteration[] | FixedPointIteration[];
}

export type ErrorObject = {
	statusCode: string;
	message: string;
};

export type DataIteration = BisectionIteration[] | FixedPointIteration[];
