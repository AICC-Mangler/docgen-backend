import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule, ProjectModule, TimelineModule } from './modules/module';
import { AuthenticationModule } from './modules/authentication.module';
import { typeOrmConfig } from './config/typeorm.config';
import { JWT_MODULE_OPTIONS } from './config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    JwtModule.register(JWT_MODULE_OPTIONS),
    MemberModule,
    HttpModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
