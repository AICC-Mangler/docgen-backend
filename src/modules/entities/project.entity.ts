import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Timeline } from './timeline.entity';
import { Hashtag } from './hashtag.entity';
import { ProjectHashtag } from './projectHashtag.entity';
import { ProjectStatus } from '../dto/project.dto';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false })
  member_id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  introduction: string;

  @Column({
    type: 'varchar',
    length: 15,
    enum: ProjectStatus,
    nullable: false,
  })
  project_status: ProjectStatus;

  @DeleteDateColumn({ name: 'deleted_date_time', type: 'timestamp' })
  deleted_date_time: Date;

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

  // 관계 설정: 프로젝트와 타임라인은 1:N 관계
  @OneToMany(() => Timeline, (timeline) => timeline.project)
  timelines: Timeline[];

  // 관계 설정: 프로젝트와 해시태그는 N:M 관계
  @ManyToMany(() => Hashtag, (hashtag) => hashtag.projects)
  @JoinTable({
    name: 'project_hashtag',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hashtag_id',
      referencedColumnName: 'id',
    },
  })
  hashtags: Hashtag[];

  // 관계 설정: 프로젝트와 프로젝트해시태그는 1:N 관계
  @OneToMany(() => ProjectHashtag, (projectHashtag) => projectHashtag.project)
  projectHashtags: ProjectHashtag[];
}
