export interface ExtrapolationRequest {
	n_point: number | string;
	x: number[] | string[];
	y: number[] | string[];
	requestX: number | string;
	m: number | string;
}
