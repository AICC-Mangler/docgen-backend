import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  DocumentModule,
  MemberModule,
  ProjectModule,
  TimelineModule,
} from './modules/module';
import { typeOrmConfig } from './config/typeorm.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MemberModule,
    HttpModule,
    DocumentModule,
    ProjectModule,
    TimelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
