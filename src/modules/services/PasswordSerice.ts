import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
      console.log('비밀번호 해시화 완료');
      return hashedPassword;
    } catch (error) {
      console.error('비밀번호 해시화 오류:', error);
      throw new Error(`비밀번호 해시화 실패: ${error.message}`);
    }
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('비밀번호 검증 완료');
      return isMatch;
    } catch (error) {
      console.error('비밀번호 검증 오류:', error);
      throw new Error(`비밀번호 검증 실패: ${error.message}`);
    }
  }
}
