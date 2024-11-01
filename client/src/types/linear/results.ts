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

export interface MatrixIterationResult extends LinearResult {
	iterations: MatrixIteration[];
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

export interface MatrixIteration {
	iteration: number[];
	error: number[];
}
