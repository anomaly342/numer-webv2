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

export interface LinearRequest {
	size: number;
	a: number[][] | string[][];
	b: number[] | string[];
}

export type RequestData =
	| RootRequest
	| BisectionRequest
	| FixedPointRequest
	| SecantRequest
	| LinearRequest;

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

export interface RootResult {
	value: number;
	iterations: BisectionIteration[] | FixedPointIteration[];
}

export interface LinearResult {
	value: number[];
}

export interface CramerResult extends LinearResult {
	matrixA_i: number[][][];
	detA_i: number[];
	detA: number;
}

export interface LUResult extends LinearResult {
	b: number[];
	upper: number[][];
	lower: number[][];
	invertedUpper: number[][];
	invertedLower: number[][];
	y: number[];
}

export interface GaussResult extends LinearResult {
	iterations: GaussIteration[];
}

export interface InversionResult extends LinearResult {
	b: number[];
	iterations: InversionIteration[];
}

export interface CholeskyResult extends LinearResult {
	b: number[];
	lower: number[][];
	lower_t: number[][];
	invertedLower: number[][];
	invertedLower_t: number[][];
	y: number[];
}

export type Operation = "divide" | "multiple";

export interface Change {
	rowAffected: number;
	rowOperator: number;
	operation: Operation;
	constant: number;
}

export interface LinearIteration {
	change: Change | undefined;
}

export interface GaussIteration extends LinearIteration {
	a: number[][];
	b: number[];
}

export interface InversionIteration extends LinearIteration {
	a: number[][];
	invertedMatrix: number[][];
}

export type ErrorObject = {
	statusCode: string;
	message: string;
};

export type DataIteration = BisectionIteration[] | FixedPointIteration[];
export type ResultData =
	| RootResult
	| CramerResult
	| GaussResult
	| InversionResult
	| LUResult
	| CholeskyResult
	| Error;
