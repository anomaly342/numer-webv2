import { Body, Controller, Post } from '@nestjs/common';
import { ExtrapolationService } from './extrapolation.service';
import { ApiTags } from '@nestjs/swagger';
import { ExtrapolationRequest } from './dto/request.dto';
import { ExtrapolationResult } from './dto/result.dto';

@ApiTags('extrapolation')
@Controller('extrapolation')
export class ExtrapolationController {
  constructor(private extrapolationService: ExtrapolationService) {}

  @Post('simple_regression')
  Simple_regression(
    @Body() extrapolationRequest: ExtrapolationRequest,
  ): ExtrapolationResult {
    return this.extrapolationService.Simple_regression(extrapolationRequest);
  }
}
