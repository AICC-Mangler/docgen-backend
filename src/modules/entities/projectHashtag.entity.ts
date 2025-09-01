import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Hashtag } from './hashtag.entity';

@Entity('project_hashtag')
export class ProjectHashtag {
  @PrimaryColumn({ name: 'project_id', type: 'bigint' })
  project_id: number;

  @PrimaryColumn({ name: 'hashtag_id', type: 'bigint' })
  hashtag_id: number;

  @CreateDateColumn({
    name: 'created_date_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date_time: Date;

  @UpdateDateColumn({
    name: 'updated_date_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_date_time: Date;

  // 프로젝트와의 관계
  @ManyToOne(() => Project, (project) => project.projectHashtags)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // 해시태그와의 관계
  @ManyToOne(() => Hashtag, (hashtag) => hashtag.projectHashtags)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
