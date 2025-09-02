import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { ProjectHashtag } from './projectHashtag.entity';

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'hashtag_name', type: 'varchar', length: 10 })
  hashtag_name: string;

  // 프로젝트와의 다대다 관계
  @ManyToMany(() => Project, (project) => project.hashtags)
  projects: Project[];

  // 프로젝트해시태그와의 1:N 관계
  @OneToMany(() => ProjectHashtag, (projectHashtag) => projectHashtag.hashtag)
  projectHashtags: ProjectHashtag[];
}
