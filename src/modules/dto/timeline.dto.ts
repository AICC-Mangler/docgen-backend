import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

// Timeline 생성 DTO
export class CreateTimelineDto {
  @IsNumber()
  project_id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  title: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsDateString()
  eventDate: string;
}

// Timeline 수정 DTO
export class UpdateTimelineDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;
}

// Timeline 응답 DTO
export class TimelineResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  project_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  eventDate: string;

  @IsDateString()
  created_date_time: string;

  @IsDateString()
  updated_date_time: string;
}

// Timeline 목록 응답 DTO
export class TimelineListResponseDto {
  success: boolean;
  data: TimelineResponseDto[];
  message: string;
  total: number;
}

// Timeline 단일 응답 DTO
export class TimelineSingleResponseDto {
  success: boolean;
  data: TimelineResponseDto;
  message: string;
}
