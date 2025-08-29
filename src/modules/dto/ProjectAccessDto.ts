import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ProjectAccessDto {
  @ApiProperty({
    description: '권한을 부여할 회원 이메일',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 형식을 입력해 주세요.' })
  @IsNotEmpty({ message: '회원 이메일을 입력해 주세요.' })
  email: string;
}
