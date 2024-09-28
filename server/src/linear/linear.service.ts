import { matrix as toMatrix, det } from 'mathjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinearRequest } from './dto/Request.dto';
import { CramerResult, GaussResult } from './dto/Result.dto';
import { cloneDeep } from 'lodash';

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
      value: new Array(3).fill(0),
      iterations: [],
    } as GaussResult;

    let _a = cloneDeep(a);
    let _b = [...b];

    let pivot_value: number;
    let divider: number;

    result.iterations.push({ a: a, b: b, change: undefined });
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
}
