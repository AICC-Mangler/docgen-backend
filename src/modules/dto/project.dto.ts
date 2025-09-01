import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';

export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
}

export class CreateProjectDto {
  @IsNumber()
  @IsNotEmpty({ message: '멤버 ID는 필수입니다.' })
  member_id: number;

  @IsString()
  @IsNotEmpty({ message: '프로젝트 제목은 필수입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '프로젝트 설명은 필수입니다.' })
  introduction: string;

  @IsEnum(ProjectStatus)
  project_status: ProjectStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '프로젝트 제목은 비어있을 수 없습니다.' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '프로젝트 설명은 비어있을 수 없습니다.' })
  introduction?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  project_status?: ProjectStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}

export class ProjectResponseDto {
  id: number;
  member_id: number;
  title: string;
  introduction: string;
  project_status: ProjectStatus;
  created_date_time: string;
  updated_date_time: string;
  hashtags?: string[];
}

export class ProjectListResponseDto {
  success: boolean;
  data: ProjectResponseDto[];
  message: string;
  total: number;
}

export class ProjectSingleResponseDto {
  success: boolean;
  data: ProjectResponseDto;
  message: string;
}
