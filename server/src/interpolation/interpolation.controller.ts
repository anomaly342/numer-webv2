import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterpolationService } from './interpolation.service';
import { InterpolationResult, LagrangeResult } from './dto/Result.dto';
import { InterpolationRequest } from './dto/Request.dto';

@ApiTags('interpolation')
@Controller('interpolation')
export class InterpolationController {
  constructor(private interpolationService: InterpolationService) {}

  @Post('lagrange')
  Lagrange(@Body() interpolationRequest: InterpolationRequest): LagrangeResult {
    return this.interpolationService.Lagrange(interpolationRequest);
  }

  @Post('spline')
  Spline(
    @Body() interpolationRequest: InterpolationRequest,
  ): InterpolationResult {
    return this.interpolationService.Spline(interpolationRequest);
  }
}
