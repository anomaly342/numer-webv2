export class Iteration {
  xl: number;
  xr: number;
  t: number;
  ft: number;
  error: number;
}

export class Result {
  value: number;
  iterations: Iteration[];
}
