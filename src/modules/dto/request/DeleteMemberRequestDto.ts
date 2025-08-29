import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class DeleteMemberRequestDto {
  @ApiProperty({
    example: 'password123!!',
    description: '현재 비밀번호',
  })
  @IsNotEmpty({ message: '현재 비밀번호를 입력해 주세요.' })
  @IsString({ message: '현재 비밀번호는 문자열만 입력해 주세요.' })
  @MinLength(8, { message: '현재 비밀번호는 최소 8자 이상 입력해 주세요.' })
  @MaxLength(32, { message: '현재 비밀번호는 최대 32자 이내로 입력해 주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '현재 비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    example: 'password123!!',
    description: '현재 비밀번호 확인 (password와 일치해야 함)',
  })
  @IsNotEmpty({ message: '현재 비밀번호 확인을 입력해 주세요.' })
  @IsString({ message: '현재 비밀번호 확인은 문자열만 입력해 주세요.' })
  @MinLength(8, {
    message: '현재 비밀번호 확인은 최소 8자 이상 입력해 주세요.',
  })
  @MaxLength(32, {
    message: '현재 비밀번호 확인은 최대 32자 이내로 입력해 주세요.',
  })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{8,}$/, {
    message: '현재 비밀번호 확인은 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  passwordConfirm: string;
}
