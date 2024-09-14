export type BisectionRequest = {
	expression: string;
	start: number;
	end: number;
	error: number;
};

export type Data = BisectionRequest;

export type Iteration = {
	xl: number;
	xr: number;
	t: number;
	ft: number;
	error: number;
};

export type Result = {
	value: number;
	iterations: Iteration[];
};

export type ErrorObject = {
	statusCode: string;
	message: string;
};
