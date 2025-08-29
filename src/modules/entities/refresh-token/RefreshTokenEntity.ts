import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MemberEntity } from '../MemberEntity';

@Entity('refresh_token')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  member_id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiry_date_time: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_date_time',
    nullable: true,
  })
  created_date_time: Date;

  @ManyToOne(() => MemberEntity, (member) => member.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;
}
