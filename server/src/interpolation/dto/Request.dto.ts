import { IsNumber, Max, Min, Validate, ValidateNested } from 'class-validator';

export class InterpolationRequest {
  @IsNumber()
  readonly n_point = 5;

  @IsNumber({}, { each: true })
  readonly x = [0, 20000, 40000, 60000, 80000];

  @IsNumber({}, { each: true })
  readonly y = [9.81, 9.7487, 9.6879, 9.6879, 9.5682];

  @IsNumber()
  readonly requestX = 40064;
}
