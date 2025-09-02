import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {
  DocumentIdResponseDto,
  FunctionalDocumentResponseDto,
  PolicyDocumentResponseDto,
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

  async find_documents_project_id(
    project_id : string,
  ){
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/api/project/${project_id}`,
    );
    return response;
  }


  async create_functional_document(
    request_data,
  ) {
    const payload = JSON.parse(JSON.stringify(request_data));
    const response = await requestFastApi(
      this.httpService,
      'post',
      '/api/document/functional',
      { data: payload },
    );
    return response;
  }

  async delete_functional_document(document_id: string): Promise<void> {
    await requestFastApi(
      this.httpService,
      'delete',
      `/api/document/functional/${document_id}`,
    );
  }
  async find_functional_document(
    document_id: string,
  ): Promise<FunctionalDocumentResponseDto> {
    const response = await requestFastApi(
      this.httpService,
      'get',
      `/api/document/functional/${document_id}`,
    );
    const result = plainToInstance(FunctionalDocumentResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async generate_functional_excel(document_id: string, response: Response) {
    const document = await this.find_functional_document(document_id);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('테스트');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '시스템', key: 'name', width: 20 },
      { header: '기능', key: 'function', width: 20 },
      { header: '세부기능', key: 'detail_function', width: 30 },
      { header: '설명', key: 'description', width: 50 },
    ];

    document.document.data.forEach((functional) => {
      functional.details.forEach((detail) => {
        sheet.addRow([
          '-',
          '-',
          functional.name,
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



  async create_policy_document(
    request_data,
  ) {
    const payload = JSON.parse(JSON.stringify(request_data));
    const response = await requestFastApi(
      this.httpService,
      'post',
      '/api/document/policy',
      { data: payload },
    );
    return response;
  }

  async delete_policy_document(document_id: string): Promise<void> {
    await requestFastApi(
      this.httpService,
      'delete',
      `/api/document/policy/${document_id}`,
    );
  }
  async find_policy_document(
    document_id: string,
  ): Promise<PolicyDocumentResponseDto> {
    try {
      const response = await requestFastApi(
        this.httpService,
        'get',
        `/api/document/policy/${document_id}`,
      );
      const result = plainToInstance(PolicyDocumentResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return result;

    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `엑셀 생성 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async generate_policy_excel(document_id: string, response: Response) {
    const document = await this.find_policy_document(document_id);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('테스트');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '시스템', key: 'name', width: 20 },
      { header: '정책', key: 'policy', width: 20 },
      { header: '역할', key: 'role', width: 20 },
      { header: '생성', key: 'create', width: 10 },
      { header: '읽기', key: 'read', width: 10 },
      { header: '수정', key: 'update', width: 10 },
      { header: '삭제', key: 'delete', width: 10 },
      { header: '설명', key: 'description', width: 50 },
    ];

    document.document.data.forEach((policy) => {
      policy.roles.forEach((role) => {
        sheet.addRow([
          '-',
          '-',
          policy.name,
          role.role,
          role.create,
          role.read,
          role.update,
          role.delete,
          role.description
        ]);
      });
    });

    merge_column(sheet, 3);
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
