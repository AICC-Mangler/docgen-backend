import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 100 })
  role: string;

  @Column({ length: 255 })
  password: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_date_time: Date;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date_time: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_date_time: Date;
}
