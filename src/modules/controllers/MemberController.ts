import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MemberService } from '../services/MemberServices';
import {
  UpdateMemberDto,
  MemberListResponseDto,
  MemberSingleResponseDto,
} from '../dto/member.dto';
import { DefaultResponseDto } from '../dto/response/DafaultResponseDto';
import { MemberResponseDto } from '../dto/member.dto';
import { ProjectAccessDto } from '../dto/ProjectAccessDto';
import { JwtAuthGuard } from '../guard/JwtAuthGuard';
import { DeleteMemberRequestDto } from '../dto/request/DeleteMemberRequestDto';
import { PasswordUpdateMemberRequestDto } from '../dto/request/PasswordUpeateRequestDto';

// Request 타입 확장
interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

@ApiTags('회원 관리')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/list')
  @ApiOperation({
    summary: '전체 회원 조회',
    description: '모든 회원 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '회원 목록 조회 성공' })
  async getAllMembers(): Promise<DefaultResponseDto<MemberResponseDto[]>> {
    try {
      console.log('=== Member 테이블 전체 조회 요청 ===');
      const members = await this.memberService.findAll();

      return {
        statusCode: HttpStatus.OK,
        message: 'Member List',
        data: members.map((member) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role as any,
          created_date_time: member.created_date_time,
          updated_date_time: member.updated_date_time,
        })),
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `멤버 조회 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 회원 조회',
    description: 'ID로 특정 회원 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '회원 ID' })
  @ApiResponse({ status: 200, description: '회원 조회 성공' })
  @ApiResponse({ status: 400, description: '유효하지 않은 ID' })
  async getMemberById(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto<MemberResponseDto>> {
    try {
      const memberId = parseInt(id, 10);
      if (isNaN(memberId)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '유효하지 않은 ID입니다.',
            data: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== Member ID ${memberId} 조회 요청 ===`);
      const member = await this.memberService.findById(memberId);

      return {
        statusCode: HttpStatus.OK,
        message: `ID ${memberId}인 멤버를 성공적으로 조회했습니다.`,
        data: {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role as any,
          created_date_time: member.created_date_time,
          updated_date_time: member.updated_date_time,
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
          message: `멤버 조회 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/access')
  @ApiOperation({
    summary: '프로젝트 열람 권한 부여',
    description: '기존 회원에게 프로젝트 열람 권한을 부여합니다.',
  })
  @ApiResponse({ status: 201, description: '권한 부여 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  async grantProjectAccess(
    @Body() grantAccessDto: ProjectAccessDto,
  ): Promise<DefaultResponseDto<MemberResponseDto>> {
    try {
      console.log('=== 프로젝트 열람 권한 부여 요청 ===');
      console.log('입력 데이터:', {
        email: grantAccessDto.email,
      });

      const updatedMember =
        await this.memberService.ProjectAccess(grantAccessDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: '프로젝트 열람 권한이 성공적으로 부여되었습니다.',
        data: {
          id: updatedMember.id,
          name: updatedMember.name,
          email: updatedMember.email,
          role: updatedMember.role as any,
          created_date_time: updatedMember.created_date_time,
          updated_date_time: updatedMember.updated_date_time,
        },
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `권한 부여 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/password/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원 정보 수정',
    description: '비밀번호를 변경합니다.',
  })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 (비밀번호 불일치)' })
  @ApiResponse({ status: 401, description: '현재 비밀번호 불일치' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  async updatePassword(
    @Body() passwordUpdateDto: PasswordUpdateMemberRequestDto,
    @Request() request: RequestWithUser,
  ): Promise<DefaultResponseDto<null>> {
    try {
      const memberId = request.user?.id;

      if (!memberId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: '인증 정보가 없습니다.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 새 비밀번호와 새 비밀번호 확인 일치 검증
      if (
        passwordUpdateDto.newPassword !== passwordUpdateDto.newPasswordConfirm
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.',
            data: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 현재 비밀번호 검증
      const currentPasswordMatch = await this.memberService.validatePassword(
        memberId,
        passwordUpdateDto.currentPassword,
      );
      if (!currentPasswordMatch) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: '현재 비밀번호가 일치하지 않습니다.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 새 비밀번호 업데이트
      await this.memberService.updatePassword(
        memberId,
        passwordUpdateDto.newPassword,
      );
      console.log(`=== Member ID ${memberId} 비밀번호 변경 완료 ===`);

      return {
        statusCode: HttpStatus.OK,
        message: '비밀번호가 성공적으로 변경되었습니다.',
        data: null,
      };
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `비밀번호 변경 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '계정을 탈퇴합니다.',
  })
  @ApiResponse({ status: 200, description: '탈퇴 성공' })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (비밀번호 불일치)',
  })
  @ApiResponse({ status: 401, description: '비밀번호 불일치' })
  async deleteMember(
    @Body() deleteMemberRequestDto: DeleteMemberRequestDto,
    @Request() request: RequestWithUser,
  ): Promise<DefaultResponseDto<null>> {
    try {
      const memberId = request.user?.id;

      if (!memberId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: '인증 정보가 없습니다.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 비밀번호와 비밀번호 확인 일치 검증
      if (
        deleteMemberRequestDto.password !==
        deleteMemberRequestDto.passwordConfirm
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
            data: null,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // memberService에서 비밀번호 확인
      const passwordMatch = await this.memberService.validatePassword(
        memberId,
        deleteMemberRequestDto.password,
      );
      if (!passwordMatch) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: '비밀번호가 일치하지 않습니다.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      console.log(`=== Member ID ${memberId} 탈퇴 요청 ===`);
      await this.memberService.remove(memberId);

      return {
        statusCode: HttpStatus.OK,
        message: '회원 탈퇴가 완료되었습니다.',
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
          message: `회원 탈퇴 실패: ${error.message}`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
