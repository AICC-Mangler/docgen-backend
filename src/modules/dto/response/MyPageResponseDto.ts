import { ApiProperty } from '@nestjs/swagger';

export class MyPageResponseDto {
  @ApiProperty({
    description: '회원 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '회원 이메일',
    example: 'test@example.com',
  })
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
