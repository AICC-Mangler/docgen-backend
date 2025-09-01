import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

// Timeline 생성 DTO
export class CreateTimelineDto {
  @IsNumber()
  @IsNotEmpty({ message: '프로젝트 ID는 필수입니다.' })
  project_id: number;

  @IsString()
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(25, { message: '제목은 최대 25자까지 가능합니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '설명은 필수입니다.' })
  @MaxLength(100, { message: '설명은 최대 100자까지 가능합니다.' })
  description: string;

  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다. (YYYY-MM-DD)' })
  @IsNotEmpty({ message: '이벤트 날짜는 필수입니다.' })
  event_date: string;
}

// Timeline 수정 DTO
export class UpdateTimelineDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(25, { message: '제목은 최대 25자까지 가능합니다.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '설명은 최대 100자까지 가능합니다.' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다. (YYYY-MM-DD)' })
  event_date?: string;
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
  event_date: string;

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
