import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  NoticeResponseDto,
  NoticeListResponseDto,
} from '../dto/notice.dto';
import { Notice } from '../entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
    private dataSource: DataSource,
  ) {}

  // 공지사항 전체 조회 (페이지네이션)
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ notices: any[]; total: number }> {
    const offset = (page - 1) * limit;

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notice n
      WHERE n.deleted_date_time IS NULL
    `;

    // 페이지네이션된 데이터 조회
    const dataQuery = `
      SELECT
        id, member_id, title, content, noticetype, 
        TO_CHAR(post_date, 'YYYY-MM-DD') as post_date,
        created_date_time, updated_date_time
      FROM notice n
      WHERE n.deleted_date_time IS NULL
      ORDER BY n.post_date DESC, n.id ASC
      LIMIT $1 OFFSET $2
    `;

    try {
      const [countResult, notices] = await Promise.all([
        this.dataSource.query(countQuery),
        this.dataSource.query(dataQuery, [limit, offset]),
      ]);

      const total = parseInt(countResult[0].total, 10);
      console.log('조회된 공지사항 데이터:', notices);
      console.log('전체 개수:', total);

      return { notices, total };
    } catch (error) {
      console.error('공지사항 조회 실패 : ', error);
      throw new Error('공지사항 조회 실패 :' + error.message);
    }
  }

  // 공지사항 생성
  async create(createNoticeDto: CreateNoticeDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertNoticeQuery = `
      INSERT INTO notice (member_id, title, content, noticetype, post_date, created_date_time, updated_date_time)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, member_id, title, content, noticetype, TO_CHAR(post_date, 'YYYY-MM-DD') as post_date, created_date_time, updated_date_time
      `;

      const noticeResult = await queryRunner.query(insertNoticeQuery, [
        createNoticeDto.member_id,
        createNoticeDto.title,
        createNoticeDto.content,
        createNoticeDto.noticetype,
        createNoticeDto.post_date,
      ]);

      await queryRunner.commitTransaction();
      return noticeResult[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByNoticeId(noticeId: number): Promise<any> {
    const query = `
    SELECT
      id, member_id, title, content, noticetype,
      TO_CHAR(post_date, 'YYYY-MM-DD') as post_date,
      created_date_time, updated_date_time
    FROM
    notice n
    WHERE n.id = $1
    `;
    try {
      const notices = await this.dataSource.query(query, [noticeId]);
      if (notices.length === 0) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }
      return notices[0]; // 배열의 첫 번째 요소 반환
    } catch (error) {
      console.error('공지사항 조회 실패 : ', error);
      throw new Error('공지사항 조회 실패 :' + error.message);
    }
  }

  // 공지사항 수정
  async update(
    noticeId: number,
    updateNoticeDto: UpdateNoticeDto,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 먼저 공지사항이 존재하는지 확인
      const existingNotice = await this.findByNoticeId(noticeId);
      if (!existingNotice) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }

      // 업데이트할 필드들만 동적으로 구성
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateNoticeDto.title !== undefined) {
        updateFields.push(`title = $${paramIndex}`);
        updateValues.push(updateNoticeDto.title);
        paramIndex++;
      }

      if (updateNoticeDto.content !== undefined) {
        updateFields.push(`content = $${paramIndex}`);
        updateValues.push(updateNoticeDto.content);
        paramIndex++;
      }

      if (updateNoticeDto.noticetype !== undefined) {
        updateFields.push(`noticetype = $${paramIndex}`);
        updateValues.push(updateNoticeDto.noticetype);
        paramIndex++;
      }

      if (updateNoticeDto.post_date !== undefined) {
        updateFields.push(`post_date = $${paramIndex}`);
        updateValues.push(updateNoticeDto.post_date);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        throw new Error('수정할 데이터가 없습니다.');
      }

      // updated_date_time 추가
      updateFields.push(`updated_date_time = CURRENT_TIMESTAMP`);
      updateValues.push(noticeId); // WHERE 조건용

      const updateQuery = `
        UPDATE notice 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, member_id, title, content, noticetype, TO_CHAR(post_date, 'YYYY-MM-DD') as post_date, created_date_time, updated_date_time
      `;

      const result = await queryRunner.query(updateQuery, updateValues);
      await queryRunner.commitTransaction();

      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 공지사항 삭제
  async remove(noticeId: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 먼저 공지사항이 존재하는지 확인
      const existingNotice = await this.findByNoticeId(noticeId);
      if (!existingNotice) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }

      const deleteQuery = `
        UPDATE notice 
        SET deleted_date_time = CURRENT_TIMESTAMP
        WHERE id = $1
      `;

      await queryRunner.query(deleteQuery, [noticeId]);
      await queryRunner.commitTransaction();

      return { success: true, message: '공지사항이 삭제되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
