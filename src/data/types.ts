/** 경력·프로젝트 한 줄. 비어 있는 선택 항목은 화면에 렌더링하지 않습니다. */
export interface ActivityItem {
  /** 회사·조직·프로젝트 이름 */
  title: string;
  /** 예) "2021.03 – 현재" */
  period: string;
  /** 본인의 역할 */
  role: string;
  /** 한두 문장 설명 */
  summary?: string;
  /** 사실을 확인할 수 있는 공개 링크 (기사, 공식 페이지 등) */
  sourceUrl?: string;
}

export interface OfficialLink {
  label: string;
  /** 본인 계정의 전체 URL (https://...). 핸들로 추정해서 만들지 않습니다. */
  url: string;
}
