import { Injectable } from '@nestjs/common';
import { InterpolationRequest } from './dto/Request.dto';
import {
  InterpolationResult,
  LagrangeResult,
  SplineResult,
} from './dto/Result.dto';

@Injectable()
export class InterpolationService {
  Lagrange(interpolationRequest: InterpolationRequest): LagrangeResult {
    const { n_point, requestX, x, y } = interpolationRequest;

    const l_list = Array(n_point);

    const result: LagrangeResult = {
      l_list: [],
      value: undefined,
      x: [...x],
      y: [...y],
      requestX: undefined,
    };

    let upperFraction = 1;
    let lowerFraction = 1;

    for (let currentL = 0; currentL < n_point; currentL++) {
      upperFraction = 1;
      lowerFraction = 1;
      for (let i = 0; i < n_point; i++) {
        if (currentL != i) {
          upperFraction = upperFraction * (x[i] - requestX);
          lowerFraction = lowerFraction * (x[i] - x[currentL]);
        }
      }
      result.l_list.push(upperFraction / lowerFraction);
      l_list[currentL] = upperFraction / lowerFraction;
    }

    let total = 0;
    for (let i = 0; i < n_point; i++) {
      total += l_list[i] * y[i];
    }

    result.value = total;
    result.requestX = requestX;
    return result;
  }

  Spline(interpolationRequest: InterpolationRequest): InterpolationResult {
    const { n_point, requestX, x, y } = interpolationRequest;
    const result: SplineResult = {
      requestX: requestX,
      value: undefined,
      x: [...x],
      y: [...y],
      x_high: undefined,
      x_low: undefined,
      y_high: undefined,
      y_low: undefined,
    };

    const rangeArr = Array(n_point - 1);

    for (let i = 1; i < x.length; i++) {
      rangeArr[i - 1] = [y[i - 1], (y[i] - y[i - 1]) / (x[i] - x[i - 1])];
    }

    for (let i = 1; i < x.length; i++) {
      if (requestX < x[i]) {
        result.x_high = x[i];
        result.x_low = x[i - 1];
        result.y_high = y[i];
        result.y_low = y[i - 1];

        result.value =
          rangeArr[i - 1][0] + rangeArr[i - 1][1] * (requestX - x[i - 1]);
        break;
      }
    }

    return result;
  }
}
