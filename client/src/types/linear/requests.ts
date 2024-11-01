export interface LinearRequest {
	size: number;
	a: number[][] | string[][];
	b: number[] | string[];
}

export interface MatrixIterationRequest extends LinearRequest {
	initial_xs: number[] | string[];
	error: number | string;
}
