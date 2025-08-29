import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { MemberRole } from '../dto/member.dto';

@Entity('member')
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  name: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'varchar',
    length: 10,
    enum: MemberRole,
    default: MemberRole.USER,
  })
  role: MemberRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_date_time: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date_time: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_date_time: Date | null;
}
