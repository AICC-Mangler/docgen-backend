import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { NoticeType } from '../dto/notice.dto';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false })
  member_id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({
    type: 'varchar',
    length: 15,
    enum: NoticeType,
    nullable: false,
  })
  noticetype: NoticeType;

  @Column({ name: 'post_date', type: 'date' })
  post_date: Date;

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
}
