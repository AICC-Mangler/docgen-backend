import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MemberEntity } from '../entities/MemberEntity';
import { RefreshTokenEntity } from '../entities/refresh-token/RefreshTokenEntity';
import { SignupRequestDto } from '../dto/request/SignupRequestDto';
import { SigninRequestDto } from '../dto/request/SigninRequestDto';
import { TokenResponseDto } from '../dto/response/TokenResponseDto';
import { DefaultResponseDto } from '../dto/response/DafaultResponseDto';
import { PasswordService } from './PasswordSerice';
import { MemberRole } from '../dto/member.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    signUpRequestDto: SignupRequestDto,
  ): Promise<DefaultResponseDto<number>> {
    try {
      const { email, password, passwordConfirm, name } = signUpRequestDto;

      // 비밀번호 확인
      if (password !== passwordConfirm) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      // 이메일 중복 체크
      const existingMember = await this.memberRepository.findOne({
        where: { email },
      });

      if (existingMember) {
        throw new Error('이미 존재하는 이메일입니다.');
      }

      // 비밀번호 해시화
      const hashedPassword = await this.passwordService.hashPassword(password);

      // 회원 생성
      const member = this.memberRepository.create({
        email,
        password: hashedPassword,
        name,
        role: MemberRole.USER,
      });

      // 회원 저장
      const savedMember = await this.memberRepository.save(member);

      console.log('새 회원이 가입되었습니다:', {
        id: savedMember.id,
        name: savedMember.name,
        email: savedMember.email,
        role: savedMember.role,
      });

      return DefaultResponseDto.created(savedMember.id);
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw new Error(`회원가입 실패: ${error.message}`);
    }
  }

  async signIn(
    signInRequestDto: SigninRequestDto,
  ): Promise<DefaultResponseDto<TokenResponseDto>> {
    try {
      const { email, password } = signInRequestDto;

      // 1. 회원 존재 여부 확인
      const member = await this.memberRepository.findOne({
        where: { email },
      });

      if (!member) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      // 2. 비밀번호 검증
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        member.password,
      );

      if (!isPasswordValid) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      // 3. 토큰 생성
      const payload = {
        sub: member.id,
        email: member.email,
        role: member.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '10m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // 4. Refresh Token 저장
      await this.saveRefreshToken(member.id, refreshToken);

      console.log('로그인 성공:', {
        userId: member.id,
        email: member.email,
        role: member.role,
      });

      return DefaultResponseDto.success(
        new TokenResponseDto(accessToken, refreshToken, 600),
      );
    } catch (error) {
      console.error('로그인 오류:', error);
      throw new Error(`로그인 실패: ${error.message}`);
    }
  }

  async signOut(userId: number): Promise<DefaultResponseDto<void>> {
    try {
      // Refresh Token 삭제
      await this.refreshTokenRepository.delete({
        member_id: userId,
      });

      console.log('로그아웃 성공 (User ID:', userId, ')');

      return DefaultResponseDto.success();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw new Error(`로그아웃 실패: ${error.message}`);
    }
  }

  async refreshToken(
    token: string,
  ): Promise<DefaultResponseDto<TokenResponseDto>> {
    try {
      // 토큰 검증 및 갱신 로직
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '10m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // 기존 토큰 삭제 후 새 토큰 저장
      await this.refreshTokenRepository.delete({ member_id: payload.sub });
      await this.saveRefreshToken(payload.sub, newRefreshToken);

      console.log('토큰 갱신 성공 (User ID:', payload.sub, ')');

      return DefaultResponseDto.success(
        new TokenResponseDto(newAccessToken, newRefreshToken, 600),
      );
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      throw new Error(`토큰 갱신 실패: ${error.message}`);
    }
  }

  private async saveRefreshToken(
    userId: number,
    token: string,
    keepLoggedIn: boolean = false,
  ): Promise<void> {
    try {
      const expiry_date_time = new Date();
      expiry_date_time.setDate(
        expiry_date_time.getDate() + (keepLoggedIn ? 30 : 7),
      );

      await this.refreshTokenRepository.save({
        member_id: userId,
        token,
        expiry_date_time,
      });

      console.log('Refresh Token 저장 완료 (User ID:', userId, ')');
    } catch (error) {
      console.error('Refresh Token 저장 오류:', error);
      throw new Error(`Refresh Token 저장 실패: ${error.message}`);
    }
  }

  async validateRefreshToken(userId: number, token: string): Promise<boolean> {
    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: {
          member_id: userId,
          token,
          expiry_date_time: MoreThan(new Date()),
        },
      });

      return !!refreshToken;
    } catch (error) {
      console.error('Refresh Token 검증 오류:', error);
      throw new Error(`Refresh Token 검증 실패: ${error.message}`);
    }
  }
}
