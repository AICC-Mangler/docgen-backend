import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
  IsDate,
  ValidateNested,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class TestDto {
  @IsNumber()
  @Expose()
  item_id: number;
}

export class DocumentIdResponseDto {
  @IsString()
  @Expose()
  document_id: string;
}

export class RequirementDetailDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;
}

export class RequirementDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => RequirementDetailDto) // ✅ 중첩 DTO 지정
  @Expose()
  details: RequirementDetailDto[];
}

export class RequirementMetadataDto {
  @IsString()
  @Expose()
  requirement_summary: string;
}

export class RequirementDocumentDto {
  @Expose()
  name: string;

  @ValidateNested()
  @Type(() => RequirementMetadataDto)
  @Expose()
  metadata: RequirementMetadataDto;

  @ValidateNested({ each: true })
  @Type(() => RequirementDto)
  @Expose()
  data: RequirementDto[];
}

export class RequirementDocumentResponseDto {
  @IsString()
  @Expose()
  id: string;
  @IsString()
  @Expose()
  owner_id: string;

  @IsString()
  @Expose()
  project_id: string;

  @IsString()
  @Expose()
  status: string;

  @IsDate()
  @Expose()
  create_date: Date;

  @Expose()
  @Type(() => RequirementDocumentDto)
  document: RequirementDocumentDto;
}

export class RequirementDocumentRequestDto {
  @IsString()
  @Expose()
  owner_id: string;

  @IsString()
  @Expose()
  project_id: string;

  @IsString()
  @Expose()
  requirement: string;
}

export class RequirementDocumentLoadDto {
  @IsString()
  @Expose()
  project_id: string;
}

export class RequirementDocumentListResponseDto {
  @IsBoolean()
  @Expose()
  success: boolean;
  @Expose()
  @Type(() => RequirementDocumentDto)
  data: RequirementDocumentResponseDto[];
  @IsString()
  @Expose()
  message: string;
  @IsNumber()
  @Expose()
  total: number;
}

export class RequirementDocumentSingleResponseDto {
  @IsBoolean()
  @Expose()
  success: boolean;
  @Expose()
  @Type(() => RequirementDocumentDto)
  data: RequirementDocumentResponseDto;
  @IsString()
  @Expose()
  message: string;
}

export class RequirementQuestionsDto {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  questions : string[];
}

export class RequirementQuestionsResponseDto{
  @IsBoolean()
  @Expose()
  success: boolean;
  @Expose()
  @Type(() => RequirementQuestionsDto)
  data: RequirementQuestionsDto;
  @IsString()
  @Expose()
  message: string;
}