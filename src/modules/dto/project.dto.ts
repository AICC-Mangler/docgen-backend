import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: '프로젝트 제목은 필수입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '프로젝트 설명은 필수입니다.' })
  description: string;

  @IsDateString()
  @IsNotEmpty({ message: '이벤트 날짜는 필수입니다.' })
  event_date: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '프로젝트 제목은 비어있을 수 없습니다.' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '프로젝트 설명은 비어있을 수 없습니다.' })
  description?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty({ message: '이벤트 날짜는 비어있을 수 없습니다.' })
  event_date?: string;
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
