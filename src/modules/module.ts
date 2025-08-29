import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';
import { Member } from './entities/member.entity';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
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
