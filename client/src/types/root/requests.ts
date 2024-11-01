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
