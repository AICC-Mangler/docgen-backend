import { ApiProperty } from '@nestjs/swagger';

/**
 * API 응답의 공통 구조를 정의하는 제네릭 클래스입니다.
 *
 * @typeParam T - 응답 데이터의 타입
 *
 * @remarks
 * 이 클래스는 상태 코드, 메시지, 페이징 정보, 응답 데이터를 포함할 수 있으며,
 * 정적 팩토리 메서드를 통해 다양한 응답 패턴을 쉽게 생성할 수 있도록 구성되어 있습니다.
 *
 * 주요 필드:
 * - statusCode: 응답 상태 코드 (예: 200, 400, 500)
 * - message: 응답 메시지
 * - pagination: 페이징 정보 객체 (Page<T>)
 * - data: 실제 반환 데이터 (제네릭)
 *
 * 주요 메서드:
 * - response: 데이터 없이 상태 코드와 메시지만 반환
 * - responseWithData: 데이터 포함 응답 반환
 * - responseWithPaginationAndData: 페이징 정보 포함 응답 반환
 *
 * @example
 * ```typescript
 * // 기본 응답
 * const basicResponse = DefaultResponseDto.response(200, '성공');
 *
 * // 데이터 포함 응답
 * const dataResponse = DefaultResponseDto.responseWithData(200, '성공', { id: 1 });
 *
 * // 페이징 응답
 * const pageResponse = DefaultResponseDto.responseWithPaginationAndData(200, '성공', pageData);
 * ```
 */
export class DefaultResponseDto<T = any> {
  @ApiProperty({
    example: 200,
    description: 'HTTP 상태 코드',
  })
  statusCode!: number;

  @ApiProperty({
    example: '성공적으로 처리되었습니다.',
    description: '응답 메시지',
  })
  message!: string;

  @ApiProperty({
    example: null,
    description: '응답 데이터 (optional)',
    required: false,
  })
  data?: T;

  private constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(data?: T): DefaultResponseDto<T> {
    return new DefaultResponseDto<T>(200, '성공적으로 처리되었습니다.', data);
  }

  static created<T>(data?: T): DefaultResponseDto<T> {
    return new DefaultResponseDto<T>(201, '성공적으로 생성되었습니다.', data);
  }

  static error(statusCode: number, message: string): DefaultResponseDto<null> {
    return new DefaultResponseDto(statusCode, message);
  }

  static response<T>(
    statusCode: number,
    message: string,
    data?: T,
  ): DefaultResponseDto<T> {
    return new DefaultResponseDto(statusCode, message, data);
  }
}

/**
 * 페이지네이션 정보를 포함하는 응답을 위한 인터페이스입니다.
 *
 * @typeParam T - 페이지네이션 항목의 타입
 *
 * @property items - 현재 페이지의 항목 배열
 * @property total - 전체 항목 수
 * @property page - 현재 페이지 번호
 * @property limit - 페이지당 항목 수
 * @property hasMore - 다음 페이지 존재 여부
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 페이지네이션이 포함된 응답을 생성하는 유틸리티 함수입니다.
 *
 * @typeParam T - 페이지네이션 항목의 타입
 * @param items - 현재 페이지의 항목 배열
 * @param total - 전체 항목 수
 * @param page - 현재 페이지 번호
 * @param limit - 페이지당 항목 수
 *
 * @returns 페이지네이션 응답 객체
 *
 * @example
 * ```typescript
 * const paginatedData = createPaginationResponse(
 *   items,    // 현재 페이지 항목들
 *   100,      // 전체 항목 수
 *   1,        // 현재 페이지
 *   10        // 페이지당 항목 수
 * );
 * ```
 */
export function createPaginationResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResponse<T> {
  return {
    items,
    total,
    page,
    limit,
    hasMore: total > page * limit,
  };
}
