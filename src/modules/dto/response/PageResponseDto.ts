/**
 * 페이징 응답 데이터를 구성하는 공통 클래스입니다.
 *
 * @typeParam T - 페이지네이션 항목의 타입
 *
 * @remarks
 * API 목록 응답에서 페이징 정보를 포함할 때 사용되며,
 * 전체 개수, 현재 페이지, 총 페이지 수, 데이터 배열 등을 포함합니다.
 *
 * 주요 필드:
 * - perPageSize: 한 페이지당 항목 수
 * - totalCount: 전체 항목 수
 * - totalPage: 전체 페이지 수 (자동 계산)
 * - data: 실제 데이터 배열 (제네릭 타입 T)
 *
 * 주의사항:
 * - 페이지 계산은 Math.ceil을 기반으로 하며, 최소 페이지 수는 1입니다.
 *
 * @example
 * const page = new Page(
 *   1,              // 현재 페이지
 *   10,             // 페이지당 항목 수
 *   100,            // 전체 항목 수
 *   [user1, user2]  // 현재 페이지 데이터
 * );
 * ```
 */
export class Page<T> {
  /**
   * 현재 페이지 번호입니다.
   *
   * @remarks
   * 1부터 시작하며, 유효하지 않은 값이 입력될 경우 자동으로 보정됩니다.
   * - 0 이하: 1로 보정
   * - 총 페이지 수 초과: 마지막 페이지로 보정
   *
   * @example
   * currentPage: 1
   * ```
   */
  currentPage: number;

  /**
   * 한 페이지에 표시할 항목 수입니다.
   *
   * @remarks
   * 페이지당 표시될 최대 데이터 개수를 지정합니다.
   *
   * @example
   * perPageSize: 10
   * ```
   */
  perPageSize: number;

  /**
   * 전체 항목 수입니다.
   *
   * @remarks
   * 검색 조건에 해당하는 전체 데이터의 개수입니다.
   *
   * @example
   * totalCount: 100
   */
  totalCount: number;

  /**
   * 전체 페이지 수입니다.
   *
   * @remarks
   * totalCount와 perPageSize를 기반으로 자동 계산됩니다.
   * Math.ceil 함수를 사용하여 올림 처리되며, 최소값은 1입니다.
   *
   * @example
   * totalPage: 10  // totalCount: 100, perPageSize: 10인 경우
   */
  totalPage: number;

  /**
   * 현재 페이지의 실제 데이터 목록입니다.
   *
   * @remarks
   * 제네릭 타입 T의 배열로, 현재 페이지에 해당하는 데이터들이 포함됩니다.
   *
   * @example
   * data: [
   *   { id: 1, name: "John" },
   *   { id: 2, name: "Jane" }
   * ]
   */
  data: T[];

  /**
   * Page 객체를 생성합니다.
   *
   * @param currentPage - 현재 페이지 번호
   * @param perPageSize - 한 페이지당 항목 수
   * @param totalCount - 전체 항목 수
   * @param results - 현재 페이지의 데이터 배열
   *
   * @remarks
   * 생성자에서는 다음과 같은 유효성 검사와 보정을 수행합니다:
   * 1. 전체 페이지 수 계산 (최소값 1)
   * 2. 현재 페이지 번호 유효성 검사 및 보정
   *
   * @example
   * const page = new Page(
   *   1,    // currentPage
   *   10,   // perPageSize
   *   100,  // totalCount
   *   users // results
   * );
   */
  constructor(
    currentPage: number,
    perPageSize: number,
    totalCount: number,
    results: T[],
  ) {
    this.perPageSize = perPageSize;
    this.totalCount = totalCount;

    const calculatedPage: number = Math.ceil(totalCount / perPageSize);

    // 총 페이지 수 계산
    if (calculatedPage < 1) {
      // logger.warn('페이징 계산 중 총 페이지 개수가 1보다 작은 결과로 인해 1로 강제 적용');
      this.totalPage = 1;
    } else {
      this.totalPage = calculatedPage;
    }

    // 현재 페이지 유효성 보정
    if (currentPage < 1) {
      this.currentPage = 1;
    } else if (currentPage > this.totalPage) {
      this.currentPage = this.totalPage;
    } else {
      this.currentPage = currentPage;
    }

    this.data = results;
  }

  /**
   * 디버깅을 위한 문자열 표현을 반환합니다.
   *
   * @returns 페이지 정보를 포함한 문자열
   *
   * @example
   * const page = new Page(1, 10, 100, users);
   * console.log(page.toString());
   * // 출력: "Page(perPageSize=10, currentPage=1, totalCount=100, totalPage=10, data=[...])"
   */
  toString(): string {
    return `Page(perPageSize=${this.perPageSize}, currentPage=${this.currentPage}, totalCount=${this.totalCount}, totalPage=${this.totalPage}, data=${JSON.stringify(this.data, null, 2)})`;
  }
}
