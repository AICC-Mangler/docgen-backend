import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Timeline } from './timeline.entity';

@Entity('projectHashtag')
export class ProjectHashtag {
  @Column({ type: 'bigint', nullable: false })
  project_id: number;

  @Column({ type: 'bigint', nullable: false })
  hashtag_id: number;

  @DeleteDateColumn({
    name: 'deleted_date_time',
    type: 'timestamp',
  })
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
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_date_time: Date;
}
