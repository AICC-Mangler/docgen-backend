import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Timeline } from './timeline.entity';
import { ProjectStatus } from '../dto/project.dto';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: false })
  member_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  introduction: string;

  @Column({ type: 'date', nullable: false })
  project_status: string;

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
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_date_time: Date;

  // 관계 설정: 프로젝트와 타임라인은 1:N 관계
  @OneToMany(() => Timeline, (timeline) => timeline.project)
  timelines: Timeline[];
}
