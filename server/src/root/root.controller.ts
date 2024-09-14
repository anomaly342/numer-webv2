import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalculationRequest } from './dto/CalculationRequest.dto';
import { RootService } from './root.service';
import { Result } from './dto/Result.dto';
@ApiTags('root')
@Controller('root')
export class RootController {
  constructor(private rootService: RootService) {}

  @Get()
  findAll(): string {
    return 'test';
  }

  @Post('bisection')
  Bisection(
    @Body()
    calculationRequest: CalculationRequest,
  ): Result {
    return this.rootService.Bisection(calculationRequest);
  }
}
