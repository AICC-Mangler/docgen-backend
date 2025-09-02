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
import { NoticeService } from '../services/notice.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  NoticeListResponseDto,
  NoticeSingleResponseDto,
} from '../dto/notice.dto';

@ApiTags('공지사항')
@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get(':noticeId')
  @ApiParam({ name: 'noticeId', description: '공지사항 ID' })
  @ApiOperation({
    summary: '공지사항 목록 조회',
    description: '공지사항 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '공지 사항 목록 조회 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async findByNoticeId(@Param('noticeId') noticeId: number): Promise<any> {
    try {
      const notice = await this.noticeService.findByNoticeId(noticeId);
      return {
        success: true,
        data: notice,
        message: '공지사항 조회 성공',
      };
    } catch (error) {
      console.error('컨트롤러 오류', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `공지사항 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('')
  @ApiOperation({
    summary: '공지사항 목록 조회',
    description: '공지사항 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '공지 사항 목록 조회 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async findAll(): Promise<any> {
    try {
      const notices = await this.noticeService.findAll();
      return {
        success: true,
        data: notices,
        message: '공지사항 조회 성공',
        total: notices.length,
      };
    } catch (error) {
      console.error('공지사항 조회 실패', error);
      throw new HttpException(
        {
          success: false,
          message: '공지사항 조회 실패',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('')
  @ApiOperation({
    summary: '공지사항 생성',
    description: '새로운 공지사항을 생성합니다.',
  })
  @ApiResponse({ status: 201, description: '공지 사항 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<any> {
    try {
      const newNotice = await this.noticeService.create(createNoticeDto);
      return {
        success: true,
        data: newNotice,
        message: '공지사항 생성 성공',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: '공지사항 생성 실패',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':noticeId')
  @ApiParam({ name: 'noticeId', description: '공지사항 ID' })
  @ApiOperation({
    summary: '공지사항 수정',
    description: '기존 공지사항을 수정합니다.',
  })
  @ApiResponse({ status: 200, description: '공지사항 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async update(
    @Param('noticeId') noticeId: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ): Promise<any> {
    try {
      const updatedNotice = await this.noticeService.update(
        noticeId,
        updateNoticeDto,
      );
      return {
        success: true,
        data: updatedNotice,
        message: '공지사항 수정 성공',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: '공지사항 수정 실패',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':noticeId')
  @ApiParam({ name: 'noticeId', description: '공지사항 ID' })
  @ApiOperation({
    summary: '공지사항 삭제',
    description: '공지사항을 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '공지사항 삭제 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async remove(@Param('noticeId') noticeId: number): Promise<any> {
    try {
      const result = await this.noticeService.remove(noticeId);
      return {
        success: true,
        data: result,
        message: '공지사항 삭제 성공',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: '공지사항 삭제 실패',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
