import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { TimelineService } from '../services/timeline.service';
import {
  CreateTimelineDto,
  UpdateTimelineDto,
  TimelineListResponseDto,
  TimelineSingleResponseDto,
} from '../dto/timeline.dto';
import { ProjectListResponseDto } from '../dto/project.dto';

@Controller('timelines')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get('projects')
  async getTimelinesByProjectId(
    @Query('id') id: number,
  ): Promise<TimelineListResponseDto> {
    try {
      const projectId = id;
      if (isNaN(projectId)) {
        throw new HttpException(
          '유효하지 않은 프로젝트 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== 프로젝트 ID ${projectId}의 타임라인 조회 요청 ===`);
      const timelines =
        await this.timelineService.findByProjectIdForResponse(projectId);

      return {
        success: true,
        data: timelines,
        message: `프로젝트 ID ${projectId}의 타임라인 목록`,
        total: timelines.length,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `타임라인 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTimeline(
    @Body() createTimelineDto: CreateTimelineDto,
  ): Promise<TimelineSingleResponseDto> {
    try {
      console.log('=== 새 타임라인 생성 요청 ===');
      console.log('입력 데이터:', {
        project_id: createTimelineDto.project_id,
        title: createTimelineDto.title,
        description: createTimelineDto.description,
        event_date: createTimelineDto.event_date,
      });

      const newTimeline = await this.timelineService.create(createTimelineDto);
      const responseTimeline = await this.timelineService.findByIdForResponse(
        newTimeline.id,
      );

      return {
        success: true,
        data: responseTimeline,
        message: '새 타임라인이 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      // NotFoundException 처리
      if (error.message.includes('찾을 수 없습니다')) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: `타임라인 생성 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTimeline(
    @Param('id') id: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
  ): Promise<TimelineSingleResponseDto> {
    try {
      const timelineId = parseInt(id, 10);
      if (isNaN(timelineId)) {
        throw new HttpException(
          '유효하지 않은 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== Timeline ID ${timelineId} 수정 요청 ===`);
      console.log('수정 데이터:', updateTimelineDto);

      const updatedTimeline = await this.timelineService.update(
        timelineId,
        updateTimelineDto,
      );
      const responseTimeline = await this.timelineService.findByIdForResponse(
        updatedTimeline.id,
      );

      return {
        success: true,
        data: responseTimeline,
        message: `ID ${timelineId}인 타임라인이 성공적으로 수정되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      // NotFoundException 처리
      if (error.message.includes('찾을 수 없습니다')) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: `타임라인 수정 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteTimeline(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const timelineId = parseInt(id, 10);
      if (isNaN(timelineId)) {
        throw new HttpException(
          '유효하지 않은 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== Timeline ID ${timelineId} 삭제 요청 ===`);
      await this.timelineService.remove(timelineId);

      return {
        success: true,
        message: `ID ${timelineId}인 타임라인이 성공적으로 삭제되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      // NotFoundException 처리
      if (error.message.includes('찾을 수 없습니다')) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: `타임라인 삭제 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
