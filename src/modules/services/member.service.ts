import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto, UpdateMemberDto, MemberResponseDto } from '../dto/member.dto';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}
  
  async findAll(): Promise<Member[]> {
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

  async findById(id: number): Promise<Member> {
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

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const member = this.memberRepository.create(createMemberDto);
      const savedMember = await this.memberRepository.save(member);
      console.log('새 멤버가 생성되었습니다:', { 
        id: savedMember.id, 
        name: savedMember.name, 
        email: savedMember.email, 
        role: savedMember.role 
      });
      return savedMember;
    } catch (error) {
      console.error('멤버 생성 오류:', error);
      throw new Error(`멤버 생성 실패: ${error.message}`);
    }
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    try {
      const member = await this.findById(id);
      Object.assign(member, updateMemberDto);
      const updatedMember = await this.memberRepository.save(member);
      console.log('멤버가 수정되었습니다:', { 
        id: updatedMember.id, 
        name: updatedMember.name, 
        email: updatedMember.email, 
        role: updatedMember.role 
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
  toResponseDto(member: Member): MemberResponseDto {
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
    return members.map(member => this.toResponseDto(member));
  }

  // 응답용 단일 멤버 조회
  async findByIdForResponse(id: number): Promise<MemberResponseDto> {
    const member = await this.findById(id);
    return this.toResponseDto(member);
  }
}
