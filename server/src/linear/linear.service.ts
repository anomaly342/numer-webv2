import { matrix as toMatrix, det, multiply, inv, transpose } from 'mathjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinearRequest } from './dto/Request.dto';
import {
  CholeskyResult,
  CramerResult,
  GaussResult,
  InversionResult,
  LUResult,
} from './dto/Result.dto';
import { cloneDeep } from 'lodash';

const getNestedArray = (size: number) =>
  Array.from({ length: size }, () => Array(size).fill(0));

const isSymmetric = (mat: number[][], size: number) => {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (mat[i][j] != mat[j][i]) {
        return false;
      }
  return true;
};

@Injectable()
export class LinearService {
  Cramer(linearRequest: LinearRequest): CramerResult {
    const { size, a, b } = linearRequest;

    const detA = det(toMatrix(a));

    if (detA === 0) {
      throw new HttpException(
        'Determinant of A cannot be zero.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const result: CramerResult = {
      value: [],
      matrixA_i: [],
      detA_i: [],
      detA: detA,
    };

    let _a: number[][];
    let detA_i: number;
    let value: number;
    for (let i = 0; i < size; i++) {
      _a = cloneDeep(a);
      for (let j = 0; j < size; j++) {
        _a[j][i] = b[j];
      }

      detA_i = det(toMatrix(_a));
      value = detA_i / detA;

      result.detA_i.push(detA_i);
      result.value.push(value);
      result.matrixA_i.push(cloneDeep(_a));
    }

    return result;
  }

  Gauss(linearRequest: LinearRequest): GaussResult {
    const { size, a, b } = linearRequest;
    const result = {
      value: new Array(size).fill(0),
      iterations: [],
    } as GaussResult;

    let _a = cloneDeep(a);
    let _b = [...b];

    let pivot_value: number;
    let divider: number;

    result.iterations.push({ a: a, b: b, change: undefined });
    // Forward elimination
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= i; j++) {
        divider = _a[j][j];

        if (i === j) {
          _a[j] = _a[j].map((e) => e / divider);
          _b[j] /= divider;

          result.iterations.push({
            a: cloneDeep(_a),
            b: [..._b],
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'divide',
              constant: divider,
            },
          });

          continue;
        }

        if (_a[i][j] !== 0) {
          pivot_value = _a[i][j];
          _a[i] = _a[i].map((e, k) => e - _a[j][k] * pivot_value);
          _b[i] -= _b[j] * pivot_value;

          result.iterations.push({
            a: cloneDeep(_a),
            b: [..._b],
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'multiple',
              constant: pivot_value,
            },
          });
          continue;
        }
      }
    }

    let total = 0;
    for (let i = size - 1; i >= 0; i--) {
      total = _b[i];
      for (let j = i + 1; j < size; j++) {
        total -= _a[i][j] * result.value[j];
      }
      result.value[i] = total;
    }

    return result;
  }

  Gauss_jordan(linearRequest: LinearRequest): GaussResult {
    const { size, a, b } = linearRequest;
    const result = {
      value: new Array(size).fill(0),
      iterations: [],
    } as GaussResult;

    let _a = cloneDeep(a);
    let _b = [...b];

    let pivot_value: number;
    let divider: number;

    result.iterations.push({ a: a, b: b, change: undefined });
    // Forward elimination
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= i; j++) {
        divider = _a[j][j];

        if (i === j) {
          _a[j] = _a[j].map((e) => e / divider);
          _b[j] /= divider;

          result.iterations.push({
            a: cloneDeep(_a),
            b: [..._b],
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'divide',
              constant: divider,
            },
          });

          continue;
        }

        if (_a[i][j] !== 0) {
          pivot_value = _a[i][j];
          _a[i] = _a[i].map((e, k) => e - _a[j][k] * pivot_value);
          _b[i] -= _b[j] * pivot_value;

          result.iterations.push({
            a: cloneDeep(_a),
            b: [..._b],
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'multiple',
              constant: pivot_value,
            },
          });
          continue;
        }
      }
    }

    // Backward elimination

    for (let i = size - 1; i >= 0; i--) {
      for (let j = size - 1; j > i; j--) {
        if (_a[i][j] !== 0) {
          pivot_value = _a[i][j];
          _a[i] = _a[i].map((e, k) => e - _a[j][k] * pivot_value);
          _b[i] -= _b[j] * pivot_value;
          result.iterations.push({
            a: cloneDeep(_a),
            b: [..._b],
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'multiple',
              constant: pivot_value,
            },
          });
        }
      }
    }

    result.value = _b;
    return result;
  }

  Matrix_inversion(linearRequest: LinearRequest): InversionResult {
    const { size, a, b } = linearRequest;
    const result = {
      value: new Array(size).fill(0),
      b: [...b],
      iterations: [],
    } as InversionResult;

    let _a = cloneDeep(a);
    let _invertedMatrix: number[][] = getNestedArray(size);
    let _b = [...b];

    let pivot_value: number;
    let divider: number;

    // Make it an identity matrix

    for (let i = 0; i < size; i++) {
      _invertedMatrix[i][i] = 1;
    }

    result.iterations.push({
      a: a,
      invertedMatrix: cloneDeep(_invertedMatrix),
      change: undefined,
    });
    // Forward elimination
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= i; j++) {
        divider = _a[j][j];

        if (i === j) {
          _a[j] = _a[j].map((e) => e / divider);
          _invertedMatrix[j] = _invertedMatrix[j].map((e) => e / divider);

          result.iterations.push({
            a: cloneDeep(_a),
            invertedMatrix: cloneDeep(_invertedMatrix),
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'divide',
              constant: divider,
            },
          });

          continue;
        }

        if (_a[i][j] !== 0) {
          pivot_value = _a[i][j];
          _a[i] = _a[i].map((e, k) => e - _a[j][k] * pivot_value);
          _invertedMatrix[i] = _invertedMatrix[i].map(
            (e, k) => e - _invertedMatrix[j][k] * pivot_value,
          );
          result.iterations.push({
            a: cloneDeep(_a),
            invertedMatrix: cloneDeep(_invertedMatrix),
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'multiple',
              constant: pivot_value,
            },
          });
          continue;
        }
      }
    }

    // Backward elimination

    for (let i = size - 1; i >= 0; i--) {
      for (let j = size - 1; j > i; j--) {
        if (_a[i][j] !== 0) {
          pivot_value = _a[i][j];
          _a[i] = _a[i].map((e, k) => e - _a[j][k] * pivot_value);
          _invertedMatrix[i] = _invertedMatrix[i].map(
            (e, k) => e - _invertedMatrix[j][k] * pivot_value,
          );
          result.iterations.push({
            a: cloneDeep(_a),
            invertedMatrix: cloneDeep(_invertedMatrix),
            change: {
              rowAffected: i,
              rowOperator: j,
              operation: 'multiple',
              constant: pivot_value,
            },
          });
        }
      }
    }

    const multipliedMatrix = multiply(_invertedMatrix, b);

    result.value = multipliedMatrix;

    return result;
  }

  LU_decomposition(linearRequest: LinearRequest): LUResult {
    const { size, a, b } = linearRequest;

    let y: number[];
    const result = {
      b: [...b],
      value: undefined,
      upper: undefined,
      lower: undefined,
      invertedUpper: undefined,
      invertedLower: undefined,
      y: undefined,
    } as LUResult;

    const upper: number[][] = getNestedArray(size);
    const lower: number[][] = getNestedArray(size);

    for (let i = 0; i < size; i++) {
      // Upper Triangular
      for (let k = i; k < size; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += lower[i][j] * upper[j][k];

        upper[i][k] = a[i][k] - sum;
      }

      // Lower Triangular
      for (let k = i; k < size; k++) {
        if (i == k)
          lower[i][i] = 1; // Diagonal as 1
        else {
          let sum = 0;
          for (let j = 0; j < i; j++) sum += lower[k][j] * upper[j][i];

          lower[k][i] = (a[k][i] - sum) / upper[i][i];
        }
      }
    }

    result.upper = cloneDeep(upper);
    result.lower = cloneDeep(lower);
    const invertedLower = inv(lower);
    const invertedUpper = inv(upper);

    y = multiply(invertedLower, b);
    result.y = y;
    result.invertedLower = invertedLower;
    result.invertedUpper = invertedUpper;
    result.value = multiply(invertedUpper, y);

    return result;
  }

  Cholesky_decomposition(linearRequest: LinearRequest): CholeskyResult {
    const { size, a, b } = linearRequest;

    if (!isSymmetric(a, size)) {
      throw new HttpException(
        'A must be a symmetric matrix.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let lower: number[][] = getNestedArray(size);
    let y: number[];

    const result = {
      b: [...b],
      lower: undefined,
      lower_t: undefined,
      invertedLower: undefined,
      invertedLower_t: undefined,
      y: undefined,
    } as CholeskyResult;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        if (j == i) {
          for (let k = 0; k < j; k++) {
            sum += Math.pow(lower[j][k], 2);
          }
          lower[j][j] = Math.sqrt(a[j][j] - sum);
        } else {
          for (let k = 0; k < j; k++) {
            sum += lower[i][k] * lower[j][k];
          }
          lower[i][j] = (a[i][j] - sum) / lower[j][j];
        }
      }
    }

    const lower_t = transpose(lower);
    result.lower = lower;
    result.lower_t = lower_t;
    const invertedLower = inv(lower);
    const invertedLower_t = inv(lower_t);

    y = multiply(invertedLower, b);
    result.y = y;
    result.invertedLower = invertedLower;
    result.invertedLower_t = invertedLower_t;
    result.value = multiply(invertedLower_t, y);
    return result;
  }
}
