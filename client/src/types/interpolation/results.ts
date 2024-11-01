export interface InterpolationResult {
	value: number;
	x: number[];
	y: number[];
	requestX: number;
}

export interface LagrangeResult extends InterpolationResult {
	l_list: number[];
}

export interface SplineResult extends InterpolationResult {
	x_high: number;
	x_low: number;
	y_high: number;
	y_low: number;
}
