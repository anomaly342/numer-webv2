import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { BisectionIteration, FixedIteration, Result } from './dto/Result.dto';
import { ComputeEngine } from '@cortex-js/compute-engine';
import {
  BisectionRequest,
  FixedRequest,
  SecantRequest,
} from './dto/Request.dto';

@Injectable()
export class RootService {
  constructor() {}

  Bisection(bisectionRequest: BisectionRequest): Result<BisectionIteration> {
    const ce = new ComputeEngine();
    const { expression, start, end, error } = bisectionRequest;

    const boxedExpression = ce.parse(expression);
    const result = {
      value: undefined,
      iterations: [],
    } as Result<BisectionIteration>;
    let temp_t: number,
      ft: number,
      ith = 0;

    let a = start,
      b = end,
      t = 0;
    ce.assign('x', a);
    let fa = boxedExpression.value as number;

    ce.assign('x', b);
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

      ce.assign('x', t);
      ft = boxedExpression.value as number;

      ce.assign('x', a);
      fa = boxedExpression.value as number;

      ce.assign('x', b);
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

  Falsi(bisectionRequest: BisectionRequest): Result<BisectionIteration> {
    const ce = new ComputeEngine();
    const { expression, start, end, error } = bisectionRequest;

    const boxedExpression = ce.parse(expression);
    const result = {
      value: undefined,
      iterations: [],
    } as Result<BisectionIteration>;
    let temp_t: number,
      ft: number,
      ith = 0;

    let a = start,
      b = end,
      t = 0;

    ce.assign('x', a);
    let fa = boxedExpression.value as number;

    ce.assign('x', b);
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

      ce.assign('x', a);
      fa = boxedExpression.value as number;

      ce.assign('x', b);
      fb = boxedExpression.value as number;

      t = (a * fb - b * fa) / (fb - fa);
      calculatedError = Math.abs((t - temp_t) / t) * 100;

      ce.assign('x', t);
      ft = boxedExpression.value as number;

      result.iterations.push({
        xl: a,
        xr: b,
        t: t,
        ft: ft,
        error: calculatedError,
      } as BisectionIteration);

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

  Fixed(fixedRequest: FixedRequest) {
    const ce = new ComputeEngine();
    const { expression, error, start } = fixedRequest;

    const boxedExpression = ce.parse(expression);
    let calculatedError = 0;
    let x = start;
    const result = {
      value: undefined,
      iterations: [{ x: x, error: calculatedError }],
    } as Result<FixedIteration>;

    let temp_x = x;
    let ith = 0;
    do {
      temp_x = x;

      ce.assign('x', x);
      x = boxedExpression.value as number;

      calculatedError = Math.abs((temp_x - x) / x) * 100;
      result.iterations.push({
        x: x,
        error: calculatedError,
      } as FixedIteration);

      ith++;
    } while (calculatedError >= error);
    result.value = x;
    return result;
  }

  Newton(fixedRequest: FixedRequest) {
    const ce = new ComputeEngine();
    const { expression, error, start } = fixedRequest;

    const boxedExpression = ce.parse(expression);

    const derivative = ce.box([
      'ND',
      ['Function', boxedExpression.toMathJson(), 'x'],
      'x',
    ]);

    const result = {
      value: undefined,
      iterations: [],
    } as Result<FixedIteration>;
    let calculatedError = 0;
    let x = start,
      f = 0,
      _f = 1;
    let temp_x = x;
    let ith = 0;

    do {
      temp_x = x;
      ce.assign('x', x);
      f = boxedExpression.value as number;
      _f = derivative.value as number;
      x = x - f / _f;

      calculatedError = Math.abs((temp_x - x) / x) * 100;

      result.iterations.push({
        x: x,
        error: calculatedError,
      } as FixedIteration);

      ith++;
    } while (calculatedError >= error);

    result.value = x;
    return result;
  }

  Secant(secantRequest: SecantRequest) {
    const ce = new ComputeEngine();
    const { start_0, start_1, error, expression } = secantRequest;

    const boxedExpression = ce.parse(expression);

    const result = {
      value: undefined,
      iterations: [],
    } as Result<FixedIteration>;

    let calculatedError = 0;
    let x_prev = start_0,
      x = start_1;
    let temp = 0,
      f = 0,
      f_prev;
    let ith = 0;

    if (x === x_prev) {
      throw new HttpException(
        'Value of start_0 and start_1 must not be the same.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    result.iterations.push({
      x: x_prev,
      error: calculatedError,
    } as FixedIteration);

    result.iterations.push({
      x: x,
      error: Math.abs((x_prev - x) / x) * 100,
    } as FixedIteration);

    do {
      temp = x;
      ce.assign('x', x_prev);
      f_prev = boxedExpression.value as number;

      ce.assign('x', x);
      f = boxedExpression.value as number;

      x = x - f * ((x - x_prev) / (f - f_prev));
      x_prev = temp;
      calculatedError = Math.abs((x_prev - x) / x) * 100;
      result.iterations.push({
        x: x,
        error: calculatedError,
      } as FixedIteration);
      ith++;
    } while (calculatedError >= error);

    result.value = x;
    return result;
  }
}
