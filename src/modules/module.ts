import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordService } from './services/PasswordSerice';
import { MemberController } from './controllers/MemberController';
import { MemberService } from './services/MemberServices';
import { MemberEntity } from './entities/MemberEntity';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController],
  providers: [MemberService, PasswordService],
  exports: [MemberService],
})
export class MemberModule {}

// 이런식으로 아래에 추가 하시면 됩니다요.
// @Module({
//   imports: [TypeOrmModule.forFeature([--Entity])],
//   controllers: [--Controller],
//   providers: [--Service],
//   exports: [--Service],
// })
// export class --Module {}

@Module({
  imports: [HttpModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
