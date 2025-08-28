import { Controller, Get,Post, Param, Body } from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import { RequirementDocumentRequestDto, RequirementDocumentResponseDto, TestDto } from '../dto/document.dto';

@Controller("document")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}


  @Post("requirement")
  async createRequirementDocument(@Body() requestDto : RequirementDocumentRequestDto): Promise<RequirementDocumentResponseDto> {
    return this.documentService.create_requirement_document(requestDto);
  }
}
