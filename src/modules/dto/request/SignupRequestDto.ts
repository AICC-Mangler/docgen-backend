import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({
    example: '홍길동',
    description: '이용자 이름 (2~5자)',
    minLength: 2,
    maxLength: 5,
  })
  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @IsString({ message: '이름은 문자열만 입력해 주세요.' })
  @MinLength(2, { message: '이름은 최소 2자 이상 입력해 주세요.' })
  @MaxLength(5, { message: '이름은 최대 5자 이내로 입력해 주세요.' })
  name: string;

  @ApiProperty({
    example: 'test@example.com',
    description: '이용자 Email 주소 (계정 ID) 4~50자 이내',
    minLength: 4,
    maxLength: 50,
  })
  @IsNotEmpty({ message: '이메일 주소를 입력해 주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @MaxLength(30, { message: '이메일은 최대 50자 이내로 입력해 주세요.' })
  email: string;

  @ApiProperty({
    example: 'password123!!',
    description: '비밀번호 (8~32자, 영문/숫자/특수문자)',
    minLength: 8,
    maxLength: 32,
  })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsString({ message: '비밀번호는 문자열만 입력해 주세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상 입력해 주세요.' })
  @MaxLength(32, { message: '비밀번호는 최대 32자 이내로 입력해 주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    example: 'password123!!',
    description: '비밀번호 확인 (password와 일치해야 함)',
  })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해 주세요.' })
  @IsString({ message: '비밀번호 확인은 문자열만 입력해 주세요.' })
  @MinLength(8, { message: '비밀번호 확인은 최소 8자 이상 입력해 주세요.' })
  @MaxLength(32, { message: '비밀번호 확인은 최대 32자 이내로 입력해 주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호 확인은 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  passwordConfirm: string;
}
