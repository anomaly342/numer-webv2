import { IsNumber, IsString } from 'class-validator';

export class CalculationRequest {
  @IsString()
  readonly expression: string;

  @IsNumber()
  readonly start: number;

  @IsNumber()
  readonly end: number;

  @IsNumber()
  readonly error: number;
}
