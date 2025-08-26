import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MemberService } from '../services/memberService';
import { 
  CreateMemberDto, 
  UpdateMemberDto, 
  MemberListResponseDto, 
  MemberSingleResponseDto 
} from '../dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async getAllMembers(): Promise<MemberListResponseDto> {
    try {
      console.log('=== Member 테이블 전체 조회 요청 ===');
      const members = await this.memberService.findAll();
      
      return {
        success: true,
        data: members.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role as any, // MemberRole enum으로 캐스팅
          created_date_time: member.created_date_time,
          updated_date_time: member.updated_date_time
        })),
        message: "Member List",
        total: members.length,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `멤버 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getMemberById(@Param('id') id: string): Promise<MemberSingleResponseDto> {
    try {
      const memberId = parseInt(id, 10);
      if (isNaN(memberId)) {
        throw new HttpException('유효하지 않은 ID입니다.', HttpStatus.BAD_REQUEST);
      }

      console.log(`=== Member ID ${memberId} 조회 요청 ===`);
      const member = await this.memberService.findById(memberId);
      
      return {
        success: true,
        data: {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role as any,
          created_date_time: member.created_date_time,
          updated_date_time: member.updated_date_time
        },
        message: `ID ${memberId}인 멤버를 성공적으로 조회했습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `멤버 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto
  ): Promise<MemberSingleResponseDto> {
    try {
      const memberId = parseInt(id, 10);
      if (isNaN(memberId)) {
        throw new HttpException('유효하지 않은 ID입니다.', HttpStatus.BAD_REQUEST);
      }

      console.log(`=== Member ID ${memberId} 수정 요청 ===`);
      const updatedMember = await this.memberService.update(memberId, updateMemberDto);
      
      return {
        success: true,
        data: {
          id: updatedMember.id,
          name: updatedMember.name,
          email: updatedMember.email,
          role: updatedMember.role as any,
          created_date_time: updatedMember.created_date_time,
          updated_date_time: updatedMember.updated_date_time
        },
        message: `ID ${memberId}인 멤버가 성공적으로 수정되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `멤버 수정 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      const memberId = parseInt(id, 10);
      if (isNaN(memberId)) {
        throw new HttpException('유효하지 않은 ID입니다.', HttpStatus.BAD_REQUEST);
      }

      console.log(`=== Member ID ${memberId} 삭제 요청 ===`);
      await this.memberService.remove(memberId);
      
      return {
        success: true,
        message: `ID ${memberId}인 멤버가 성공적으로 삭제되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `멤버 삭제 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createMember(@Body() createMemberDto: CreateMemberDto): Promise<MemberSingleResponseDto> {
    try {
      console.log('=== 새 멤버 생성 요청 ===');
      console.log('입력 데이터:', {
        name: createMemberDto.name,
        email: createMemberDto.email,
        role: createMemberDto.role,
        password: '[HIDDEN]'
      });
      
      const newMember = await this.memberService.create(createMemberDto);
      
      return {
        success: true,
        data: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          role: newMember.role as any,
          created_date_time: newMember.created_date_time,
          updated_date_time: newMember.updated_date_time
        },
        message: '새 멤버가 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `멤버 생성 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
