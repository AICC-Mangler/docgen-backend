import { Injectable, Logger } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {
  DocumentIdResponseDto,
  RequirementDocumentListResponseDto,
  RequirementDocumentRequestDto,
  RequirementDocumentResponseDto,
  RequirementQuestionsDto,
  RequirementQuestionsResponseDto,
  TestDto,
} from '../dto/document.dto';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { requestFastApi } from 'src/utils/http.helper';
import * as ExcelJS from 'exceljs';
import { merge_column } from 'src/utils/excel.util';
import { Response } from 'express';

@Injectable()
export class DocumentService {
  constructor(private readonly httpService: HttpService) {}

  async getTestFastAPI(item: string): Promise<TestDto> {
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/items/${item}`,
    );
    const result = plainToInstance(TestDto, response, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async create_requirement_document(
    request_data: RequirementDocumentRequestDto,
  ): Promise<DocumentIdResponseDto> {
    const payload = JSON.parse(JSON.stringify(request_data));
    const response = await requestFastApi(
      this.httpService,
      'post',
      '/api/document/requirement',
      { data: payload },
    );
    const result = plainToInstance(DocumentIdResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return result;
  }
  async generate_requirement_questions(
    questions: RequirementQuestionsDto,
  ): Promise<RequirementQuestionsDto> {
    const payload = JSON.parse(JSON.stringify(questions));
    const response = await requestFastApi(
      this.httpService,
      'post',
      '/api/document/requirement/question',
      { data: payload },
    );
    const result = plainToInstance(RequirementQuestionsDto, response, {
      excludeExtraneousValues: true,
    });
    return result;
  }
  async find_requirement_document_user(
    user_id : string,
  ): Promise<RequirementDocumentResponseDto[]>{
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/api/document/requirement/user/${user_id}`,
    );
    const result = plainToInstance(RequirementDocumentResponseDto, response, {
      excludeExtraneousValues: true,
    });
    if(Array.isArray(result)){
      return result;
    }
    return [new RequirementDocumentResponseDto()]
  }
  async find_requirement_document_project_id(
    project_id : string,
  ): Promise<RequirementDocumentResponseDto[]>{
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/api/document/requirement/project/${project_id}`,
    );
    const result = plainToInstance(RequirementDocumentResponseDto, response, {
      excludeExtraneousValues: true,
    });
    if(Array.isArray(result)){
      return result;
    }
    return [new RequirementDocumentResponseDto()]
  }
  async find_requirement_document(
    document_id: string,
  ): Promise<RequirementDocumentResponseDto> {
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/api/document/requirement/${document_id}`,
    );
    const result = plainToInstance(RequirementDocumentResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async delete_requirement_document(document_id: string): Promise<void> {
    await requestFastApi(
      this.httpService,
      'delete',
      `/api/document/requirement/${document_id}`,
    );
  }

  async generate_requirement_excel(document_id: string, response: Response) {
    const document = await this.find_requirement_document(document_id);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('테스트');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '시스템', key: 'name', width: 20 },
      { header: '기능', key: 'function', width: 20 },
      { header: '요구사항', key: 'requirement', width: 30 },
      { header: '설명', key: 'description', width: 50 },
    ];

    document.document.data.forEach((requirement) => {
      requirement.details.forEach((detail) => {
        sheet.addRow([
          '-',
          '-',
          requirement.name,
          detail.name,
          detail.description,
        ]);
      });
    });

    merge_column(sheet, 3);
    merge_column(sheet, 4);
    sheet.eachRow((row, rowNumber) => {
      row.height = 32;
    });
    sheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=report.xlsx',
    );
    await workbook.xlsx.write(response);
    response.end();
  }
}
