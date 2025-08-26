import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
  IsDate,
} from 'class-validator';

// Member 역할 enum
export enum MemberRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Member 생성 DTO
export class CreateMemberDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsEnum(MemberRole)
  role: MemberRole;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}

// Member 수정 DTO
export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}

// Member 응답 DTO (비밀번호 제외)
export class MemberResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(MemberRole)
  role: MemberRole;

  @IsDate()
  created_date_time: Date;

  @IsDate()
  updated_date_time: Date;
}

// Member 목록 응답 DTO
export class MemberListResponseDto {
  success: boolean;
  data: MemberResponseDto[];
  message: string;
  total: number;
}

// Member 단일 응답 DTO
export class MemberSingleResponseDto {
  success: boolean;
  data: MemberResponseDto;
  message: string;
}
