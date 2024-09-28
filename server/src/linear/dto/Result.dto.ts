export class LinearResult {
  value: number[];
}

export class CramerResult extends LinearResult {
  matrixA_i: number[][][];
  detA_i: number[];
  detA: number;
}

export type Operation = 'divide' | 'multiple';

export class Change {
  rowAffected: number;
  rowOperator: number;
  operation: Operation;
  constant: number;
}

export class GaussIteration {
  a: number[][];
  b: number[];
  change: Change | undefined;
}

export class GaussResult extends LinearResult {
  iterations: GaussIteration[];
}
