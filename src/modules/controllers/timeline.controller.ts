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
} from '@nestjs/common';
import { TimelineService } from '../services/timeline.service';
import {
  CreateTimelineDto,
  UpdateTimelineDto,
  TimelineListResponseDto,
  TimelineSingleResponseDto,
} from '../dto/timeline.dto';
import { ProjectListResponseDto } from '../dto/project.dto';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get('')
  async getAllProjectsByMemberId(
    @Query('id') id: number,
  ): Promise<ProjectListResponseDto> {
    try {
      console.log('=== 해당 멤버의 프로젝트 전체 조회 요청 ===');
      // const projects = await this.timelineService.findProjectByMemberId(id);
      const projects = await this.timelineService.findAllForResponse();

      return {
        success: true,
        data: projects,
        message: 'Projects List',
        total: projects.length,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('projects/:projectId')
  async getTimelinesByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<TimelineListResponseDto> {
    try {
      const projectIdNum = parseInt(projectId, 10);
      if (isNaN(projectIdNum)) {
        throw new HttpException(
          '유효하지 않은 프로젝트 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== 프로젝트 ID ${projectIdNum}의 타임라인 조회 요청 ===`);
      const timelines =
        await this.timelineService.findByProjectIdForResponse(projectIdNum);

      return {
        success: true,
        data: timelines,
        message: `프로젝트 ID ${projectIdNum}의 타임라인 목록`,
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

  //   @Get(':id')
  //   async getTimelineById(
  //     @Param('id') id: string,
  //   ): Promise<TimelineSingleResponseDto> {
  //     try {
  //       const timelineId = parseInt(id, 10);
  //       if (isNaN(timelineId)) {
  //         throw new HttpException(
  //           '유효하지 않은 ID입니다.',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       console.log(`=== Timeline ID ${timelineId} 조회 요청 ===`);
  //       const timeline =
  //         await this.timelineService.findByIdForResponse(timelineId);

  //       return {
  //         success: true,
  //         data: timeline,
  //         message: `ID ${timelineId}인 타임라인을 성공적으로 조회했습니다.`,
  //       };
  //     } catch (error) {
  //       console.error('컨트롤러 오류:', error);
  //       if (error instanceof HttpException) {
  //         throw error;
  //       }
  //       throw new HttpException(
  //         {
  //           success: false,
  //           message: `타임라인 조회 실패: ${error.message}`,
  //           error: error.message,
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  @Post()
  async createTimeline(
    @Body() createTimelineDto: CreateTimelineDto,
  ): Promise<TimelineSingleResponseDto> {
    try {
      console.log('=== 새 타임라인 생성 요청 ===');
      console.log('입력 데이터:', {
        project_id: createTimelineDto.project_id,
        title: createTimelineDto.title,
        description: createTimelineDto.description,
        eventDate: createTimelineDto.eventDate,
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
