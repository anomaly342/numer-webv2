import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootController } from './root/root.controller';
import { RootService } from './root/root.service';
import { ConfigModule } from '@nestjs/config';
import { LinearController } from './linear/linear.controller';
import { LinearService } from './linear/linear.service';
import { InterpolationController } from './interpolation/interpolation.controller';
import { InterpolationService } from './interpolation/interpolation.service';
import { ExtrapolationService } from './extrapolation/extrapolation.service';
import { ExtrapolationController } from './extrapolation/extrapolation.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, RootController, LinearController, InterpolationController, ExtrapolationController],
  providers: [AppService, RootService, LinearService, InterpolationService, ExtrapolationService],
})
export class AppModule {}
