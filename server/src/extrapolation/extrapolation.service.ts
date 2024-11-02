import { Injectable } from '@nestjs/common';
import { ExtrapolationRequest } from './dto/request.dto';
import { ExtrapolationResult } from './dto/result.dto';
import { inv, multiply } from 'mathjs';
import { cloneDeep } from 'lodash';

@Injectable()
export class ExtrapolationService {
  Simple_regression(
    extrapolationRequest: ExtrapolationRequest,
  ): ExtrapolationResult {
    const { m, n_point, requestX, x, y } = extrapolationRequest;
    let order = m;
    order++;
    const a = Array.from({ length: order }, () => Array(order).fill(0));
    const b = Array(order);
    const initialValue = 0;

    const result: ExtrapolationResult = {
      a: [],
      matrixA: undefined,
      matrixB: undefined,
      invertedMatrixA: undefined,
      value: undefined,
      m: m,
      requestX: requestX,
    };

    for (let i = 0; i < order; i++) {
      b[i] = y.reduce((accumulator, currentValue, index) => {
        return accumulator + Math.pow(x[index], i) * currentValue;
      }, initialValue);
      for (let j = 0; j < order; j++) {
        a[i][j] = x.reduce((accumulator, currentValue) => {
          return accumulator + Math.pow(currentValue, i + j);
        }, initialValue);
      }
    }

    const inversedA = inv(a);

    const answer_list = multiply(inversedA, b);

    console.log(answer_list);
    let total = 0;
    for (let i = 0; i < order; i++) {
      total += answer_list[i] * Math.pow(requestX, i);
    }

    result.matrixA = cloneDeep(a);
    result.matrixB = [...b];
    result.invertedMatrixA = cloneDeep(inversedA);
    result.a = [...answer_list];
    result.value = total;
    return result;
  }
}
