import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinearRequest, MatrixIterationRequest } from './dto/Request.dto';
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

  @Post('gauss_jordan_elimination')
  Gauss_jordan_elimination(@Body() linearRequest: LinearRequest) {
    return this.linearService.Gauss_jordan(linearRequest);
  }

  @Post('matrix_inversion')
  Matrix_inversion(@Body() linearRequest: LinearRequest) {
    return this.linearService.Matrix_inversion(linearRequest);
  }

  @Post('lu_decomposition')
  LU_decomposition(@Body() linearRequest: LinearRequest) {
    return this.linearService.LU_decomposition(linearRequest);
  }

  @Post('cholesky_decomposition')
  Cholesky_decomposition(@Body() linearRequest: LinearRequest) {
    return this.linearService.Cholesky_decomposition(linearRequest);
  }

  @Post('jacobi_iteration')
  Jacobi_iteration(@Body() matrixIterationRequest: MatrixIterationRequest) {
    return this.linearService.Jacobi_iteration(matrixIterationRequest);
  }

  @Post('gauss-seidel_iteration')
  Gauss_seldel_iteration(
    @Body() matrixIterationRequest: MatrixIterationRequest,
  ) {
    return this.linearService.Gauss_seldel_iteration(matrixIterationRequest);
  }
}
