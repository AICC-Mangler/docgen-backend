import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SigninRequestDto {
  @ApiProperty({ description: '이용자 Email 주소 (계정 ID) 4~50자 이내' })
  @IsNotEmpty({ message: '이메일 주소를 입력해 주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsString({ message: '이메일 주소는 문자열만 입력해 주세요.' })
  @MinLength(4, { message: '이메일 주소는 최소 4자 이상 입력해 주세요.' })
  @MaxLength(30, { message: '이메일 주소는 최대 30자 이내로 입력해 주세요.' })
  email: string;

  @ApiProperty({ description: '계정 비밀번호' })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsString({ message: '비밀번호는 문자열만 입력해 주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,32}$/, {
    message:
      '비밀번호는 영(소)문자, 특수문자($@$!%*#?&), 숫자(0-9)만 입력 가능하고, 8 ~ 32글자 이내로 입력해 주세요.',
  })
  password: string;

  @ApiProperty({
    description: '로그인 상태 유지',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean({ message: '로그인 상태 유지는 true/false 값만 입력해 주세요.' })
  @IsOptional()
  keepLoggedIn?: boolean;
}
