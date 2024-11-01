export class LinearResult {
  value: number[];
}

export class CramerResult extends LinearResult {
  matrixA_i: number[][][];
  detA_i: number[];
  detA: number;
}

export class GaussResult extends LinearResult {
  iterations: GaussIteration[];
}

export class InversionResult extends LinearResult {
  b: number[];
  iterations: InversionIteration[];
}

export class LUResult extends LinearResult {
  b: number[];
  upper: number[][];
  lower: number[][];
  invertedUpper: number[][];
  invertedLower: number[][];
  y: number[];
}

export class CholeskyResult extends LinearResult {
  b: number[];
  lower: number[][];
  lower_t: number[][];
  invertedLower: number[][];
  invertedLower_t: number[][];
  y: number[];
}

export class MatrixIterationResult extends LinearResult {
  iterations: MatrixIteration[];
}

export type Operation = 'divide' | 'multiple';

export class Change {
  rowAffected: number;
  rowOperator: number;
  operation: Operation;
  constant: number;
}

export class LinearIteration {
  change: Change | undefined;
}

export class GaussIteration extends LinearIteration {
  a: number[][];
  b: number[];
}

export class InversionIteration extends LinearIteration {
  a: number[][];
  invertedMatrix: number[][];
}

export class MatrixIteration {
  iteration: number[];
  error: number[];
}
