import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinearRequest } from './dto/Request.dto';
import { CramerResult } from './dto/Result.dto';
import { LinearService } from './linear.service';

@ApiTags('linear')
@Controller('linear')
@UsePipes(new ValidationPipe({ transform: true }))
export class LinearController {
  constructor(private linearService: LinearService) {}

  @Post('cramer')
  Cramer(@Body() linearRequest: LinearRequest): CramerResult {
    return this.linearService.Cramer(linearRequest);
  }

  @Post('gauss_elimination')
  Gauss_elimination(@Body() linearRequest: LinearRequest) {
    return this.linearService.Gauss(linearRequest);
  }
}
