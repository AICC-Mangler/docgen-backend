import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';
import { Member } from './entities/member.entity';
import { DocumentService } from './services/document.service';
import { DocumentController } from './controllers/document.controller';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { Project } from './entities/project.entity';
import { TimelineController } from './controllers/timeline.controller';
import { TimelineService } from './services/timeline.service';
import { Timeline } from './entities/timeline.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
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
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Timeline])],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
