import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './controllers/AuthenticationController';
import { AuthService } from './services/AuthenticationServices';
import { PasswordService } from './services/PasswordSerice';
import { RefreshTokenEntity } from './entities/refresh-token/RefreshTokenEntity';
import { MemberEntity } from './entities/MemberEntity';
import { JWT_MODULE_OPTIONS } from '../config/jwt.config';
import { JwtStrategy } from './strategy/JwtStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity, RefreshTokenEntity]),
    PassportModule,
    JwtModule.register(JWT_MODULE_OPTIONS),
  ],
  controllers: [AuthenticationController],
  providers: [AuthService, PasswordService, JwtStrategy],
  exports: [AuthService, PasswordService],
})
export class AuthenticationModule {}
