import { IsNumber, Max, Min, Validate, ValidateNested } from 'class-validator';

export class ExtrapolationRequest {
  @IsNumber()
  readonly n_point = 9;

  @IsNumber({}, { each: true })
  readonly x = [10, 15, 20, 30, 40, 50, 60, 70, 80];

  @IsNumber({}, { each: true })
  readonly y = [5, 9, 15, 18, 22, 30, 35, 38, 43];

  @IsNumber()
  readonly requestX = 65;

  @IsNumber()
  readonly m = 2;
}
