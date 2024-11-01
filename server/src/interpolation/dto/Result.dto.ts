export class InterpolationResult {
  value: number;
  x: number[];
  y: number[];
  requestX: number;
}

export class LagrangeResult extends InterpolationResult {
  l_list: number[];
}

export class SplineResult extends InterpolationResult {
  x_high: number;
  x_low: number;
  y_high: number;
  y_low: number;
}
