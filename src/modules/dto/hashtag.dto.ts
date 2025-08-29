import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateHashtagDto {
  @IsString()
  @IsNotEmpty({ message: '해시태그는 필수입니다.' })
  hashtag_name: string;
}
