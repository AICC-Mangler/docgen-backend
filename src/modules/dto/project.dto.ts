import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRSS = 'IN_PROGRESS',
  PENDEING = 'PENDING',
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: '프로젝트 제목은 필수입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '프로젝트 설명은 필수입니다.' })
  introduction: string;

  @IsEnum(ProjectStatus)
  project_status: ProjectStatus;
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
  project_status: ProjectStatus;
}

export class ProjectListResponseDto {
  success: boolean;
  data: any[];
  message: string;
  total: number;
}

export class ProjectSingleResponseDto {
  success: boolean;
  data: any;
  message: string;
}
