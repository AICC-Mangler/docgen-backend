import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Res,
} from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import {
  DocumentIdResponseDto,
  RequirementDocumentListResponseDto,
  RequirementDocumentRequestDto,
  RequirementDocumentResponseDto,
  RequirementDocumentSingleResponseDto,
  RequirementQuestionsDto,
  RequirementQuestionsResponseDto,
  TestDto,
} from '../dto/document.dto';
import type { Response } from 'express';

@Controller('api/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('requirement')
  async createRequirementDocument(
    @Body() requestDto: RequirementDocumentRequestDto,
  ): Promise<{ success: boolean; massage: string }> {
    try {
      const response =
        await this.documentService.create_requirement_document(requestDto);
      return {
        success: true,
        massage: `문서생성 요청 성공 (id: ${response.document_id})`,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `문서생성요쳥 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('requirement/questions')
  async generate_requirement_questions(
    @Body() requestDto: RequirementQuestionsDto,
  ): Promise<RequirementQuestionsResponseDto> {
    try {
      const response =
        await this.documentService.generate_requirement_questions(requestDto);
      const result = new RequirementQuestionsResponseDto();
      result.success = true;
      result.data = response;
      result.message = "질문 생성 요청 성공";
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `질문 생성 요청 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('requirement/user/:user_id')
  async getRequirementDocumentListUseUser(
    @Param('user_id') user_id: string,
  ): Promise<RequirementDocumentListResponseDto> {
    try {
      const document = await this.documentService.find_requirement_document_user(user_id);
      return {
        success: true,
        data: document,
        message: '문서 검색 성공',
        total: document.length
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `문서 검색 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('requirement/project/:project_id')
  async getRequirementDocumentListUseProject(
    @Param('project_id') project_id: string,
  ): Promise<RequirementDocumentListResponseDto> {
    try {
      const document = await this.documentService.find_requirement_document_project_id(project_id);
      return {
        success: true,
        data: document,
        message: '문서 검색 성공',
        total: document.length
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `문서 검색 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('requirement/:document_id')
  async getRequirementDocument(
    @Param('document_id') document_id: string,
  ): Promise<RequirementDocumentSingleResponseDto> {
    try {
      const document =
        await this.documentService.find_requirement_document(document_id);
      return {
        success: true,
        data: document,
        message: '문서 검색 성공',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `문서 검색 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('requirement/:document_id')
  async deleteRequirementDocument(
    @Param('document_id') document_id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.documentService.delete_requirement_document(document_id);
      return {
        success: true,
        message: '삭제 완료',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `문서 삭제 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('requirement/file/:document_id')
  async getExcel(
    @Param('document_id') document_id: string,
    @Res() response: Response,
  ) {
    this.documentService.generate_requirement_excel(document_id, response);
  }
}
