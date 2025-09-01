import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Hashtag } from '../entities/hashtag.entity';
import { ProjectHashtag } from '../entities/projectHashtag.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from '../dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
    @InjectRepository(ProjectHashtag)
    private readonly projectHashtagRepository: Repository<ProjectHashtag>,
    private readonly dataSource: DataSource,
  ) {}

  // Raw SQL을 사용한 프로젝트 조회 (해시태그 포함)
  async findProjectsWithHashtagsByMemberIdRaw(
    memberId: number,
  ): Promise<any[]> {
    const query = `
    SELECT
        p.id,
        p.member_id,
        p.title,
        p.introduction,
        p.project_status,
        p.created_date_time,
        p.updated_date_time,
		COALESCE(
  			JSON_AGG(
    			DISTINCT JSON_BUILD_OBJECT(
      			'id', h.id,
      			'hashtag_name', h.hashtag_name)::jsonb
		)FILTER (WHERE h.id IS NOT NULL),
          '[]'::json
        ) as hashtags
      FROM project p
      LEFT JOIN project_hashtag ph ON p.id = ph.project_id AND ph.deleted_date_time IS NULL
      LEFT JOIN hashtag h ON ph.hashtag_id = h.id
      WHERE p.member_id = $1 AND p.deleted_date_time IS NULL
      GROUP BY p.id, p.member_id, p.title, p.introduction, p.project_status, p.created_date_time, p.updated_date_time
      ORDER BY p.created_date_time DESC;
    `;

    const result = await this.dataSource.query(query, [memberId]);
    return result;
  }

  // Raw SQL을 사용한 단일 프로젝트 조회 (해시태그 포함)
  async findProjectByIdWithHashtagsRaw(projectId: number): Promise<any> {
    const query = `
      SELECT 
        p.id,
        p.member_id,
        p.title,
        p.introduction,
        p.project_status,
        p.created_date_time,
        p.updated_date_time,
        COALESCE(
          JSON_AGG(
            DISTINCT h.hashtag_name
          ) FILTER (WHERE h.hashtag_name IS NOT NULL),
          '[]'::json
        ) as hashtags
      FROM project p
      LEFT JOIN project_hashtag ph ON p.id = ph.project_id AND ph.deleted_date_time IS NULL
      LEFT JOIN hashtag h ON ph.hashtag_id = h.id
      WHERE p.id = $1 AND p.deleted_date_time IS NULL
      GROUP BY p.id, p.member_id, p.title, p.introduction, p.project_status, p.created_date_time, p.updated_date_time
    `;

    const result = await this.dataSource.query(query, [projectId]);
    return result[0] || null;
  }

  // Raw SQL을 사용한 해시태그 추가
  async addHashtagToProjectRaw(
    projectId: number,
    hashtagName: string,
  ): Promise<void> {
    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 해시태그가 존재하는지 확인, 없으면 생성
      let hashtagQuery = `
        SELECT id FROM hashtag 
        WHERE hashtag_name = $1
      `;
      let hashtagResult = await queryRunner.query(hashtagQuery, [hashtagName]);

      let hashtagId: number;
      if (hashtagResult.length === 0) {
        // 해시태그가 없으면 생성
        const insertHashtagQuery = `
          INSERT INTO hashtag (hashtag_name)
          VALUES ($1)
          RETURNING id
        `;
        const newHashtagResult = await queryRunner.query(insertHashtagQuery, [
          hashtagName,
        ]);
        hashtagId = newHashtagResult[0].id;
      } else {
        hashtagId = hashtagResult[0].id;
      }

      // 2. 프로젝트-해시태그 관계가 이미 존재하는지 확인
      const existingRelationQuery = `
        SELECT project_id FROM project_hashtag 
        WHERE project_id = $1 AND hashtag_id = $2
      `;
      const existingRelation = await queryRunner.query(existingRelationQuery, [
        projectId,
        hashtagId,
      ]);

      // 3. 관계가 없으면 추가
      if (existingRelation.length === 0) {
        const insertRelationQuery = `
          INSERT INTO project_hashtag (project_id, hashtag_id, created_date_time, updated_date_time)
          VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        await queryRunner.query(insertRelationQuery, [projectId, hashtagId]);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Raw SQL을 사용한 해시태그 제거
  async removeHashtagFromProjectRaw(
    projectId: number,
    hashtagName: string,
  ): Promise<void> {
    const query = `
      UPDATE project_hashtag 
      SET deleted_date_time = CURRENT_TIMESTAMP, updated_date_time = CURRENT_TIMESTAMP
      WHERE project_id = $1 AND hashtag_id = (
        SELECT id FROM hashtag WHERE hashtag_name = $2
      ) AND deleted_date_time IS NULL
    `;

    await this.dataSource.query(query, [projectId, hashtagName]);
  }

  // Raw SQL을 사용한 프로젝트 생성
  async createProjectRaw(createProjectDto: CreateProjectDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 프로젝트 생성
      const insertProjectQuery = `
        INSERT INTO project (member_id, title, introduction, project_status, created_date_time, updated_date_time)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, member_id, title, introduction, project_status, created_date_time, updated_date_time
      `;

      const projectResult = await queryRunner.query(insertProjectQuery, [
        createProjectDto.member_id,
        createProjectDto.title,
        createProjectDto.introduction,
        createProjectDto.project_status,
      ]);

      const newProject = projectResult[0];

      // 2. 해시태그 추가 (같은 트랜잭션 내에서 처리)
      if (createProjectDto.hashtags && createProjectDto.hashtags.length > 0) {
        for (const hashtagName of createProjectDto.hashtags) {
          // 해시태그가 존재하는지 확인, 없으면 생성
          let hashtagQuery = `
            SELECT id FROM hashtag 
            WHERE hashtag_name = $1
          `;
          let hashtagResult = await queryRunner.query(hashtagQuery, [
            hashtagName,
          ]);

          let hashtagId: number;
          if (hashtagResult.length === 0) {
            // 해시태그가 없으면 생성
            const insertHashtagQuery = `
              INSERT INTO hashtag (hashtag_name)
              VALUES ($1)
              RETURNING id
            `;
            const newHashtagResult = await queryRunner.query(
              insertHashtagQuery,
              [hashtagName],
            );
            hashtagId = newHashtagResult[0].id;
          } else {
            hashtagId = hashtagResult[0].id;
          }

          // 프로젝트-해시태그 관계 추가
          const insertRelationQuery = `
            INSERT INTO project_hashtag (project_id, hashtag_id, created_date_time, updated_date_time)
            VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;
          await queryRunner.query(insertRelationQuery, [
            newProject.id,
            hashtagId,
          ]);
        }
      }

      await queryRunner.commitTransaction();

      // 3. 생성된 프로젝트를 해시태그와 함께 반환
      return await this.findProjectByIdWithHashtagsRaw(newProject.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Raw SQL을 사용한 프로젝트 수정
  async updateProjectRaw(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 프로젝트 정보 업데이트
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateProjectDto.title !== undefined) {
        updateFields.push(`title = $${paramIndex++}`);
        updateValues.push(updateProjectDto.title);
      }
      if (updateProjectDto.introduction !== undefined) {
        updateFields.push(`introduction = $${paramIndex++}`);
        updateValues.push(updateProjectDto.introduction);
      }
      if (updateProjectDto.project_status !== undefined) {
        updateFields.push(`project_status = $${paramIndex++}`);
        updateValues.push(updateProjectDto.project_status);
      }

      if (updateFields.length > 0) {
        updateFields.push(`updated_date_time = CURRENT_TIMESTAMP`);
        updateValues.push(projectId);

        const updateProjectQuery = `
          UPDATE project 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
        `;

        await queryRunner.query(updateProjectQuery, updateValues);
      }

      // 2. 해시태그 업데이트
      if (updateProjectDto.hashtags !== undefined) {
        // 기존 해시태그 관계 삭제
        const deleteHashtagsQuery = `
          UPDATE project_hashtag 
          SET deleted_date_time = CURRENT_TIMESTAMP, updated_date_time = CURRENT_TIMESTAMP
          WHERE project_id = $1 AND deleted_date_time IS NULL
        `;
        await queryRunner.query(deleteHashtagsQuery, [projectId]);

        // 새 해시태그 추가
        if (updateProjectDto.hashtags.length > 0) {
          for (const hashtagName of updateProjectDto.hashtags) {
            // 해시태그가 존재하는지 확인, 없으면 생성
            let hashtagQuery = `
              SELECT id FROM hashtag 
              WHERE hashtag_name = $1
            `;
            let hashtagResult = await queryRunner.query(hashtagQuery, [
              hashtagName,
            ]);

            let hashtagId: number;
            if (hashtagResult.length === 0) {
              // 해시태그가 없으면 생성
              const insertHashtagQuery = `
                INSERT INTO hashtag (hashtag_name)
                VALUES ($1)
                RETURNING id
              `;
              const newHashtagResult = await queryRunner.query(
                insertHashtagQuery,
                [hashtagName],
              );
              hashtagId = newHashtagResult[0].id;
            } else {
              hashtagId = hashtagResult[0].id;
            }

            // 프로젝트-해시태그 관계 추가
            const insertRelationQuery = `
              INSERT INTO project_hashtag (project_id, hashtag_id, created_date_time, updated_date_time)
              VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            await queryRunner.query(insertRelationQuery, [
              projectId,
              hashtagId,
            ]);
          }
        }
      }

      await queryRunner.commitTransaction();

      // 3. 수정된 프로젝트를 해시태그와 함께 반환
      return await this.findProjectByIdWithHashtagsRaw(projectId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // DTO 변환 헬퍼 메서드
  toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      member_id: project.member_id,
      title: project.title,
      introduction: project.introduction,
      project_status: project.project_status,
      created_date_time: project.created_date_time.toString(),
      updated_date_time: project.updated_date_time.toString(),
      hashtags: project.hashtags.map((h) => h.hashtag_name) || [],
    };
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // hashtags 필드를 제외하고 프로젝트 생성
    const { hashtags, ...projectData } = createProjectDto;
    const project = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(project);

    // 해시태그가 있으면 추가
    if (hashtags && hashtags.length > 0) {
      console.log('해시태그 존재 / 추가 해시태그 = ' + hashtags);
      for (const hashtagName of hashtags) {
        await this.addHashtagToProject(savedProject.id, hashtagName);
      }
    }

    return savedProject;
  }

  async findById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`ID ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  // 프로젝트 ID로 프로젝트 조회 (해시태그 포함)
  async findByIdWithHashtags(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['hashtags'],
    });
    if (!project) {
      throw new NotFoundException(`ID ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  // 프로젝트 ID로 프로젝트 조회 (타임라인과 해시태그 포함)
  async findByIdWithTimelinesAndHashtags(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['timelines', 'hashtags'],
    });
    if (!project) {
      throw new NotFoundException(`ID ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findById(id);

    // hashtags 필드를 제외하고 프로젝트 업데이트
    const { hashtags, ...projectData } = updateProjectDto;
    Object.assign(project, projectData);
    const updatedProject = await this.projectRepository.save(project);

    // 해시태그가 있으면 기존 해시태그를 모두 제거하고 새로 추가
    if (hashtags !== undefined) {
      // 기존 해시태그 제거
      project.hashtags = [];
      await this.projectRepository.save(project);

      // 해시태그 배열 처리
      const hashtagArray = hashtags.filter((tag) => tag.trim().length > 0); // 빈 문자열 제거

      // 새 해시태그 추가
      if (hashtagArray.length > 0) {
        for (const hashtagName of hashtagArray) {
          await this.addHashtagToProject(updatedProject.id, hashtagName);
        }
      }
    }

    return updatedProject;
  }

  async remove(id: number): Promise<void> {
    const project = await this.findById(id);
    await this.projectRepository.remove(project);
  }

  // 프로젝트에 해시태그 추가
  async addHashtagToProject(
    projectId: number,
    hashtagName: string,
  ): Promise<void> {
    // 해시태그가 존재하는지 확인, 없으면 생성
    let hashtag = await this.hashtagRepository.findOne({
      where: { hashtag_name: hashtagName },
    });

    if (!hashtag) {
      hashtag = this.hashtagRepository.create({ hashtag_name: hashtagName });
      hashtag = await this.hashtagRepository.save(hashtag);
    }

    // 프로젝트에 해시태그 연결 (기존 해시태그 관계를 포함하여 조회)
    const project = await this.findByIdWithHashtags(projectId);
    if (!project.hashtags) {
      project.hashtags = [];
    }

    // 이미 존재하는 해시태그인지 확인
    const existingHashtag = project.hashtags.find((h) => h.id === hashtag.id);
    if (!existingHashtag) {
      project.hashtags.push(hashtag);
      await this.projectRepository.save(project);
    }
  }

  // 프로젝트에서 해시태그 제거
  async removeHashtagFromProject(
    projectId: number,
    hashtagName: string,
  ): Promise<void> {
    const project = await this.findByIdWithHashtags(projectId);
    project.hashtags = project.hashtags.filter(
      (hashtag) => hashtag.hashtag_name !== hashtagName,
    );
    await this.projectRepository.save(project);
  }
}
