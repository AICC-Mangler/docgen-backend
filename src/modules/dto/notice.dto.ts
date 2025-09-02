import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';

export enum NoticeType {
  NOMAL = 'NOMAL',
  EVENT = 'EVENT', // 원래는 이벤트 공지를 구분하기 위함이였지만 현재는 중요도를 정하기 위함으로 사용
}

export class CreateNoticeDto {
  @IsNumber()
  @IsNotEmpty({ message: '멤버 ID는 필수입니다.' })
  member_id: number;

  @IsString()
  @IsNotEmpty({ message: '공지사항 제목은 필수입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공지사항 내용은 필수입니다.' })
  content: string;

  @IsEnum(NoticeType)
  noticetype: NoticeType;

  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다. (YYYY-MM-DD)' })
  @IsNotEmpty({ message: '이벤트 날짜는 필수입니다.' })
  post_date: string;
}

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '공지사항 제목은 비어있을 수 없습니다.' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '공지사항 내용은 비어있을 수 없습니다.' })
  content?: string;

  @IsOptional()
  @IsEnum(NoticeType)
  noticetype?: NoticeType;

  @IsOptional()
  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다. (YYYY-MM-DD)' })
  post_date?: string;
}

export class NoticeResponseDto {
  id: number;
  member_id: number;
  title: string;
  content: string;
  created_date_time: string;
  updated_date_time: string;
  noticetype: NoticeType;
}

export class NoticeListResponseDto {
  success: boolean;
  data: NoticeResponseDto[];
  message: string;
  total: number;
}

export class NoticeSingleResponseDto {
  success: boolean;
  data: NoticeResponseDto;
  message: string;
}
