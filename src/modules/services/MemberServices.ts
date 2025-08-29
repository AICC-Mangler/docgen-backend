import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMemberDto, MemberResponseDto } from '../dto/member.dto';
import { MemberEntity } from '../entities/MemberEntity';
import { ProjectAccessDto } from '../dto/ProjectAccessDto';
import { PasswordService } from './PasswordSerice';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    private passwordService: PasswordService,
  ) {}

  async findAll(): Promise<MemberEntity[]> {
    try {
      const members = await this.memberRepository.find({
        order: { id: 'ASC' },
      });
      console.log('DB 연결 성공! Member 테이블 조회 완료');
      console.log(`총 ${members.length}개의 멤버를 찾았습니다.`);
      return members;
    } catch (error) {
      console.error('DB 연결 실패 또는 쿼리 오류:', error);
      throw new Error(`멤버 조회 실패: ${error.message}`);
    }
  }

  async findById(id: number): Promise<MemberEntity> {
    try {
      const member = await this.memberRepository.findOne({ where: { id } });
      if (!member) {
        throw new Error(`ID ${id}인 멤버를 찾을 수 없습니다.`);
      }
      return member;
    } catch (error) {
      console.error('멤버 조회 오류:', error);
      throw error;
    }
  }

  async update(
    id: number,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberEntity> {
    try {
      const member = await this.findById(id);
      Object.assign(member, updateMemberDto);
      const updatedMember = await this.memberRepository.save(member);
      console.log('멤버가 수정되었습니다:', {
        id: updatedMember.id,
        name: updatedMember.name,
        email: updatedMember.email,
        role: updatedMember.role,
      });
      return updatedMember;
    } catch (error) {
      console.error('멤버 수정 오류:', error);
      throw new Error(`멤버 수정 실패: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const member = await this.findById(id);
      await this.memberRepository.softDelete(id);
      console.log('멤버가 삭제되었습니다 (ID:', id, ')');
    } catch (error) {
      console.error('멤버 삭제 실패:', error);
      throw new Error(`멤버 삭제 실패: ${error.message}`);
    }
  }

  // DTO 변환 헬퍼 메서드
  toResponseDto(member: MemberEntity): MemberResponseDto {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role as any, // MemberRole enum으로 캐스팅
      created_date_time: member.created_date_time,
      updated_date_time: member.updated_date_time,
    };
  }

  // 응답용 멤버 목록 조회
  async findAllForResponse(): Promise<MemberResponseDto[]> {
    const members = await this.findAll();
    return members.map((member) => this.toResponseDto(member));
  }

  // 응답용 단일 멤버 조회
  async findByIdForResponse(id: number): Promise<MemberResponseDto> {
    const member = await this.findById(id);
    return this.toResponseDto(member);
  }

  async ProjectAccess(grantAccessDto: ProjectAccessDto): Promise<MemberEntity> {
    try {
      const { email } = grantAccessDto;

      // 이메일로 회원 찾기
      const member = await this.memberRepository.findOne({
        where: { email },
      });

      if (!member) {
        throw new Error(`이메일 ${email}인 회원을 찾을 수 없습니다.`);
      }

      // TODO: 프로젝트 권한 테이블에 권한 정보 저장
      // 현재는 회원 정보만 반환 (실제 구현 시 프로젝트 권한 테이블 연동 필요)

      console.log('프로젝트 열람 권한 부여 완료:', {
        memberId: member.id,
        email: member.email,
        memberName: member.name,
      });

      return member;
    } catch (error) {
      console.error('프로젝트 권한 부여 오류:', error);
      throw new Error(`프로젝트 권한 부여 실패: ${error.message}`);
    }
  }

  async validatePassword(memberId: number, password: string): Promise<boolean> {
    try {
      const member = await this.findById(memberId);
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        member.password,
      );
      return isPasswordValid;
    } catch (error) {
      console.log('비밀번호 검증 오류:', error);
      return false;
    }
  }

  async updatePassword(memberId: number, newPassword: string): Promise<void> {
    try {
      const member = await this.findById(memberId);

      // 새 비밀번호 해시화
      const hashedPassword =
        await this.passwordService.hashPassword(newPassword);

      // 비밀번호 업데이트
      member.password = hashedPassword;
      await this.memberRepository.save(member);

      console.log('비밀번호 업데이트 완료 (ID:', memberId, ')');
    } catch (error) {
      console.error('비밀번호 업데이트 실패:', error);
      throw new Error(`비밀번호 업데이트 실패: ${error.message}`);
    }
  }
}
