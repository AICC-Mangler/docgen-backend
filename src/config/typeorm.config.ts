import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';
import { MemberEntity } from '../modules/entities/MemberEntity';
import { RefreshTokenEntity } from '../modules/entities/refresh-token/RefreshTokenEntity';
import { Project } from '../modules/entities/project.entity';
import { Hashtag } from '../modules/entities/hashtag.entity';
import { ProjectHashtag } from '../modules/entities/projectHashtag.entity';
import { Timeline } from '../modules/entities/timeline.entity';
import { Notice } from '../modules/entities/notice.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: parseInt(databaseConfig.port || '5432', 10),
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  schema: databaseConfig.schema,
  entities: [
    MemberEntity,
    RefreshTokenEntity,
    Project,
    Hashtag,
    ProjectHashtag,
    Timeline,
    Notice,
  ],
  synchronize: false, // 자동 동기화
  logging: true, // SQL 쿼리 로깅(콘솔에서 쿼리 확인 여부 설정)
  ssl: false, // 암호화 시켜 데이터 수송신 여부 설정
};
