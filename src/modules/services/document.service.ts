import { Injectable, Logger } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {RequirementDocumentRequestDto, RequirementDocumentResponseDto, TestDto } from '../dto/document.dto';
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

  async create_requirement_document(request_data : RequirementDocumentRequestDto):Promise<RequirementDocumentResponseDto>{
    const payload = JSON.parse(JSON.stringify(request_data));
    console.log(payload)
    const response = await safeRequest(this.httpService, 'post', 'http://localhost:8000/api/document',{data:payload});
    const result = plainToInstance(RequirementDocumentResponseDto,response,{excludeExtraneousValues: true});
    return result;
    // return new RequirementDocumentResponseDto()
  }
}
