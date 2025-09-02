import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordService } from './services/PasswordSerice';
import { MemberController } from './controllers/MemberController';
import { MemberService } from './services/MemberServices';
import { MemberEntity } from './entities/MemberEntity';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { Project } from './entities/project.entity';
import { Hashtag } from './entities/hashtag.entity';
import { ProjectHashtag } from './entities/projectHashtag.entity';
import { TimelineController } from './controllers/timeline.controller';
import { TimelineService } from './services/timeline.service';
import { Timeline } from './entities/timeline.entity';
import { NoticeController } from './controllers/notice.controller';
import { NoticeService } from './services/notice.service';
import { Notice } from './entities/notice.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController],
  providers: [MemberService, PasswordService],
  exports: [MemberService],
})
export class MemberModule {}

@Module({
  imports: [HttpModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Project, Hashtag, ProjectHashtag])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Timeline, Project])],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
