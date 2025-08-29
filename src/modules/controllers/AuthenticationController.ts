import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../services/AuthenticationServices';
import { JwtAuthGuard } from '../guard/JwtAuthGuard';
import { SignupRequestDto } from '../dto/request/SignupRequestDto';
import { SigninRequestDto } from '../dto/request/SigninRequestDto';
import { DefaultResponseDto } from '../dto/response/DafaultResponseDto';
import { TokenResponseDto } from '../dto/response/TokenResponseDto';
import { MemberResponseDto, MemberRole } from '../dto/member.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

// Request 타입 확장
interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

@ApiTags('인증')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 회원을 등록합니다.',
  })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  async signUp(
    @Body() signUpRequestDto: SignupRequestDto,
  ): Promise<DefaultResponseDto<MemberResponseDto>> {
    try {
      console.log('=== 회원가입 요청 ===');
      console.log('입력 데이터:', {
        name: signUpRequestDto.name,
        email: signUpRequestDto.email,
        password: '[HIDDEN]',
      });

      const newMember = await this.authService.signUp(signUpRequestDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: '회원가입이 완료되었습니다.',
        data: {
          id: newMember.data || 0,
          name: signUpRequestDto.name,
          email: signUpRequestDto.email,
          role: MemberRole.USER,
          created_date_time: new Date(),
          updated_date_time: new Date(),
        },
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `회원가입 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/signin')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async signIn(
    @Body() signInRequestDto: SigninRequestDto,
  ): Promise<DefaultResponseDto<TokenResponseDto>> {
    try {
      console.log('=== 로그인 요청 ===');
      console.log('입력 데이터:', {
        email: signInRequestDto.email,
        password: '[HIDDEN]',
      });

      const result = await this.authService.signIn(signInRequestDto);

      return {
        statusCode: HttpStatus.OK,
        message: '로그인 성공',
        data: {
          accessToken: result.data?.accessToken || '',
          refreshToken: result.data?.refreshToken || '',
          expiresIn: result.data?.expiresIn || 0,
        },
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('/signout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃합니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseGuards(JwtAuthGuard)
  async signOut(
    @Request() request: RequestWithUser,
  ): Promise<DefaultResponseDto<null>> {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: '인증되지 않은 사용자입니다.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      console.log(`=== 로그아웃 요청 (User ID: ${userId}) ===`);

      await this.authService.signOut(userId);

      return {
        statusCode: HttpStatus.OK,
        message: '로그아웃 성공',
        data: null,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `로그아웃 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/refresh')
  @ApiOperation({
    summary: '토큰 갱신',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.',
  })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async refreshToken(
    @Body() refreshTokenDto: { refreshToken: string },
  ): Promise<DefaultResponseDto<TokenResponseDto>> {
    try {
      console.log('=== 토큰 갱신 요청 ===');

      // refreshTokenDto가 없거나 refreshToken이 없는 경우 처리
      if (!refreshTokenDto || !refreshTokenDto.refreshToken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '리프레시 토큰이 필요합니다.',
            data: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('입력 데이터:', {
        refreshToken: '[HIDDEN]',
      });

      const result = await this.authService.refreshToken(
        refreshTokenDto.refreshToken,
      );

      return {
        statusCode: HttpStatus.OK,
        message: '토큰 갱신 성공',
        data: {
          accessToken: result.data?.accessToken || '',
          refreshToken: result.data?.refreshToken || '',
          expiresIn: result.data?.expiresIn || 0,
        },
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '토큰 갱신 실패',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
