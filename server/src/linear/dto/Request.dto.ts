import { IsNumber, Max, Min, Validate, ValidateNested } from 'class-validator';
import { Is2dArrayNumeric } from '../validators/Is2dArrayNumeric';
import { ApiProperty } from '@nestjs/swagger';

export class LinearRequest {
  @IsNumber()
  @Min(2)
  @Max(5)
  readonly size: number = 3;

  @ApiProperty({
    type: [[Number]], // Define it as a 2D array of numbers
    example: [
      [7, 1, 5],
      [4, 3, 5],
      [6, 1, 2],
    ],
  })
  @Validate(Is2dArrayNumeric)
  readonly a: number[][] = [
    [4, 4, 7],
    [3, 6, 5],
    [1, 3, 2],
  ];

  @IsNumber({}, { each: true })
  readonly b: number[] = [27, 21, 9];
}

export class MatrixIterationRequest extends LinearRequest {
  @IsNumber({}, { each: true })
  readonly initial_xs: number[] = [0, 0, 0];

  @IsNumber()
  readonly error = 0.05;
}
