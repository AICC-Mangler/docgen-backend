import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateHashtagDto {
  @IsNotEmpty({ message: '프로젝트 ID 입력 오류' })
  project_id: number;

  @IsNotEmpty({ message: '해시태그 ID 입력 오류' })
  hastag_id: number;
}
