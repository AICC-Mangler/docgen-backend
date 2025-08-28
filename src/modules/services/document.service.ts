import { Injectable, Logger } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {DocumentIdResponseDto, RequirementDocumentRequestDto, RequirementDocumentResponseDto, TestDto } from '../dto/document.dto';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { safeRequest } from 'src/utils/http.helper';


@Injectable()
export class DocumentService {
  constructor(private readonly httpService: HttpService) {}

  async getTestFastAPI(item:string):Promise<TestDto>{    
    const response = await safeRequest(this.httpService, 'get', `http://localhost:8000/items/${item}`);
    const result = plainToInstance(TestDto,response,{excludeExtraneousValues: true})
    return result;
  }

  async create_requirement_document(request_data : RequirementDocumentRequestDto):Promise<DocumentIdResponseDto>{
    const payload = JSON.parse(JSON.stringify(request_data));
    const response = await safeRequest(this.httpService, 'post', 'http://localhost:8000/api/document',{data:payload});
    const result = plainToInstance(DocumentIdResponseDto,response,{excludeExtraneousValues: true});
    return result;
  }

  async find_requirement_document(document_id : string):Promise<RequirementDocumentResponseDto>{
    console.log(document_id["document_id"])
    const response = await safeRequest(this.httpService, 'get', `http://localhost:8000/api/document/requirement/${document_id}`);
    const result = plainToInstance(RequirementDocumentResponseDto,response,{excludeExtraneousValues: true})
    return result
  }

  async delete_requirement_document(document_id: string):Promise<void>{
    await safeRequest(this.httpService, 'delete', `http://localhost:8000/api/document/requirement/${document_id}`);
  }
}
