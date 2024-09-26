export class LinearResult {
  value: number[];
}

export class CramerResult extends LinearResult {
  matrixA_i: number[][][];
  detA_i: number[];
  detA: number;
}
