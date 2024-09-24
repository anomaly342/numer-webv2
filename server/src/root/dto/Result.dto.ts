export class Iteration {
  error: number;
}

export class BisectionIteration extends Iteration {
  xl: number;
  xr: number;
  t: number;
  ft: number;
}

export class FixedIteration extends Iteration {
  x: number;
}

export class Result<T extends Iteration> {
  value: number;
  iterations: T[];
}
