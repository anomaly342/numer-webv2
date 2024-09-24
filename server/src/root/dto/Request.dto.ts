import { IsNumber, IsString } from 'class-validator';

export class RootRequest {
  @IsString()
  readonly expression: string = 'x^4 - 7';

  @IsNumber()
  readonly error: number = 0.000001;
}

export class SecantRequest extends RootRequest {
  @IsNumber()
  readonly start_0: number = 0;

  @IsNumber()
  readonly start_1: number = 1;
}

export class FixedRequest extends RootRequest {
  @IsNumber()
  readonly start: number = 1;
}

export class BisectionRequest extends RootRequest {
  @IsNumber()
  readonly start: number = 1;

  @IsNumber()
  readonly end: number = 7;
}
