import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CalculationRequest } from './dto/CalculationRequest.dto';
import { ComputeEngine } from '@cortex-js/compute-engine';
import { Result } from './dto/Result.dto';

@Injectable()
export class RootService {
  ce: ComputeEngine;
  constructor() {
    this.ce = new ComputeEngine();
  }

  Bisection(calculationRequest: CalculationRequest): Result {
    const { expression, start, end, error } = calculationRequest;

    const boxedExpression = this.ce.parse(expression);
    const result = { value: undefined, iterations: [] } as Result;
    let temp_t: number,
      ft: number,
      ith = 0;

    let a = start,
      b = end,
      t = 0;
    console.log(b);
    this.ce.assign('x', a);
    let fa = boxedExpression.value as number;

    this.ce.assign('x', b);
    let fb = boxedExpression.value as number;

    if (fa * fb > 0) {
      throw new HttpException(
        'f(a) and f(b) have the same sign',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let calculatedError: number = 0;

    do {
      temp_t = t;
      t = (b + a) / 2;

      this.ce.assign('x', t);
      ft = boxedExpression.value as number;

      this.ce.assign('x', a);
      fa = boxedExpression.value as number;

      this.ce.assign('x', b);
      fb = boxedExpression.value as number;
      calculatedError = Math.abs((t - temp_t) / t) * 100;

      result.iterations.push({
        xl: a,
        xr: b,
        t: t,
        ft: ft,
        error: calculatedError,
      });

      if (ft == 0) {
        result.value = t;
        return result;
      } else if (ft * fa > 0) {
        a = t;
      } else {
        b = t;
      }
      ith++;
    } while (calculatedError >= error && ith > 0);

    result.value = t;
    return result;
  }
}
