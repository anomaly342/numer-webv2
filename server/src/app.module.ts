import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootController } from './root/root.controller';
import { RootService } from './root/root.service';
import { ConfigModule } from '@nestjs/config';
import { LinearController } from './linear/linear.controller';
import { LinearService } from './linear/linear.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, RootController, LinearController],
  providers: [AppService, RootService, LinearService],
})
export class AppModule {}
