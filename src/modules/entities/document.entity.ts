import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('Document')
export class Document {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  q: string
}