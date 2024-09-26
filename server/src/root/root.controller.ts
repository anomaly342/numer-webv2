import {
  Body,
  Controller,
  Get,
  Post,
  Scope,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BisectionRequest,
  FixedRequest,
  SecantRequest,
} from './dto/Request.dto';
import { BisectionIteration, FixedIteration, Result } from './dto/Result.dto';
import { ApiTags } from '@nestjs/swagger';
import { RootService } from './root.service';

@ApiTags('root')
@Controller({ path: 'root', scope: Scope.REQUEST })
@UsePipes(new ValidationPipe({ transform: true }))
export class RootController {
  constructor(private rootService: RootService) {}

  @Get()
  findAll(): string {
    return 'test';
  }

  @Post('bisection')
  Bisection(
    @Body()
    bisectionRequest: BisectionRequest,
  ): Result<BisectionIteration> {
    return this.rootService.Bisection(bisectionRequest);
  }

  @Post('false_position')
  Falsi(
    @Body()
    bisectionRequest: BisectionRequest,
  ): Result<BisectionIteration> {
    return this.rootService.Falsi(bisectionRequest);
  }

  @Post('fixed_point')
  Fixed(
    @Body()
    fixedRequest: FixedRequest,
  ): Result<FixedIteration> {
    return this.rootService.Fixed(fixedRequest);
  }

  @Post('newton_raphson')
  Newton(
    @Body()
    fixedRequest: FixedRequest,
  ): Result<FixedIteration> {
    return this.rootService.Newton(fixedRequest);
  }

  @Post('secant')
  Secant(
    @Body()
    secantRequest: SecantRequest,
  ): Result<FixedIteration> {
    return this.rootService.Secant(secantRequest);
  }
}
