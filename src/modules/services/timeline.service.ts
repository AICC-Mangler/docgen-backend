import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTimelineDto,
  UpdateTimelineDto,
  TimelineResponseDto,
} from '../dto/timeline.dto';
import { Timeline } from '../entities/timeline.entity';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
  ) {}

  async findAll(): Promise<Timeline[]> {
    try {
      const timelines = await this.timelineRepository.find({
        order: { eventDate: 'DESC', id: 'ASC' },
      });
      console.log('DB 연결 성공! Timeline 테이블 조회 완료');
      console.log(`총 ${timelines.length}개의 타임라인을 찾았습니다.`);
      return timelines;
    } catch (error) {
      console.error('DB 연결 실패 또는 쿼리 오류:', error);
      throw new Error(`타임라인 조회 실패: ${error.message}`);
    }
  }

  // async findProjectByMemberId(memberId: number): Promise<Project[]> {
  //   try {
  //     const projects = await this.projectRepository.find({
  //       where: { member_id: memberId },
  //     });
  //     console.log(`멤버 ID ${memberId}의 프로젝트 조회 완료`);
  //     console.log(`총 ${projects.length}개의 프로젝트를 찾았습니다.`);
  //     return projects;
  //   } catch (error) {
  //     console.error('프로젝트별 타임라인 조회 오류:', error);
  //     throw new Error(`프로젝트별 타임라인 조회 실패: ${error.message}`);
  //   }
  // }

  async findByProjectId(projectId: number): Promise<Timeline[]> {
    try {
      const timelines = await this.timelineRepository.find({
        where: { project_id: projectId },
        order: { eventDate: 'DESC', id: 'ASC' },
      });
      console.log(`프로젝트 ID ${projectId}의 타임라인 조회 완료`);
      console.log(`총 ${timelines.length}개의 타임라인을 찾았습니다.`);
      return timelines;
    } catch (error) {
      console.error('프로젝트별 타임라인 조회 오류:', error);
      throw new Error(`프로젝트별 타임라인 조회 실패: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Timeline> {
    try {
      const timeline = await this.timelineRepository.findOne({ where: { id } });
      if (!timeline) {
        throw new Error(`ID ${id}인 타임라인을 찾을 수 없습니다.`);
      }
      return timeline;
    } catch (error) {
      console.error('타임라인 조회 오류:', error);
      throw error;
    }
  }

  async create(createTimelineDto: CreateTimelineDto): Promise<Timeline> {
    try {
      const timeline = this.timelineRepository.create({
        ...createTimelineDto,
        eventDate: new Date(createTimelineDto.eventDate),
      });
      const savedTimeline = await this.timelineRepository.save(timeline);
      console.log('새 타임라인이 생성되었습니다:', {
        id: savedTimeline.id,
        title: savedTimeline.title,
        project_id: savedTimeline.project_id,
        eventDate: savedTimeline.eventDate,
      });
      return savedTimeline;
    } catch (error) {
      console.error('타임라인 생성 오류:', error);
      throw new Error(`타임라인 생성 실패: ${error.message}`);
    }
  }

  async update(
    id: number,
    updateTimelineDto: UpdateTimelineDto,
  ): Promise<Timeline> {
    try {
      const timeline = await this.findById(id);

      if (updateTimelineDto.eventDate) {
        updateTimelineDto.eventDate = new Date(updateTimelineDto.eventDate)
          .toISOString()
          .split('T')[0];
      }

      Object.assign(timeline, updateTimelineDto);
      const updatedTimeline = await this.timelineRepository.save(timeline);
      console.log('타임라인이 수정되었습니다:', {
        id: updatedTimeline.id,
        title: updatedTimeline.title,
        project_id: updatedTimeline.project_id,
        eventDate: updatedTimeline.eventDate,
      });
      return updatedTimeline;
    } catch (error) {
      console.error('타임라인 수정 오류:', error);
      throw new Error(`타임라인 수정 실패: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const timeline = await this.findById(id);
      await this.timelineRepository.softDelete(id);
      console.log('타임라인이 삭제되었습니다 (ID:', id, ')');
    } catch (error) {
      console.error('타임라인 삭제 실패:', error);
      throw new Error(`타임라인 삭제 실패: ${error.message}`);
    }
  }

  // DTO 변환 헬퍼 메서드
  toResponseDto(timeline: Timeline): TimelineResponseDto {
    return {
      id: timeline.id,
      project_id: timeline.project_id,
      title: timeline.title,
      description: timeline.description,
      eventDate: timeline.eventDate.toISOString().split('T')[0],
      created_date_time: timeline.created_date_time.toISOString(),
      updated_date_time: timeline.updated_date_time.toISOString(),
    };
  }

  // 응답용 타임라인 목록 조회
  async findAllForResponse(): Promise<TimelineResponseDto[]> {
    const timelines = await this.findAll();
    return timelines.map((timeline) => this.toResponseDto(timeline));
  }

  // 응답용 프로젝트별 타임라인 목록 조회
  async findByProjectIdForResponse(
    projectId: number,
  ): Promise<TimelineResponseDto[]> {
    const timelines = await this.findByProjectId(projectId);
    return timelines.map((timeline) => this.toResponseDto(timeline));
  }

  // 응답용 단일 타임라인 조회
  async findByIdForResponse(id: number): Promise<TimelineResponseDto> {
    const timeline = await this.findById(id);
    return this.toResponseDto(timeline);
  }
}
