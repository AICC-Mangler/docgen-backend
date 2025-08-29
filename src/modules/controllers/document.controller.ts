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
  RequirementDocumentRequestDto,
  RequirementDocumentResponseDto,
  RequirementDocumentSingleResponseDto,
  TestDto,
} from '../dto/document.dto';
import type { Response } from 'express';

@Controller('document')
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
