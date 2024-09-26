import { matrix as toMatrix, det } from 'mathjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinearRequest } from './dto/Request.dto';
import { CramerResult } from './dto/Result.dto';
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
}
