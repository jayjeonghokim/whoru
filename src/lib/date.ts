const TIME_ZONE = 'Asia/Seoul';

const displayFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
// en-CA 는 YYYY-MM-DD 형태로 출력된다.
const isoFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

/** 화면 표시용. 예) 2026년 10월 1일 */
export const formatDate = (date: Date): string => displayFormat.format(date);

/** <time datetime> 용. 예) 2026-10-01 */
export const isoDate = (date: Date): string => isoFormat.format(date);
