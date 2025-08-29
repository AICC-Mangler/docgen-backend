import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('timeline')
export class Timeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', type: 'bigint' })
  project_id: number;

  @Column({ length: 25 })
  title: string;

  @Column({ length: 100 })
  description: string;

  @Column({ name: 'event_date', type: 'date' })
  event_date: Date;

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

  // 프로젝트와의 관계 설정
  @ManyToOne(() => Project, (project) => project.timelines)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
