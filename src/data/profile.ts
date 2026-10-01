import type { OfficialLink } from './types';

// ─────────────────────────────────────────────────────────────
// 공개 프로필. 여기 있는 값은 홈 화면, 메타데이터, JSON-LD 에 그대로 쓰입니다.
// 확인되지 않은 값은 비워 두세요. 비어 있으면 화면에 나타나지 않습니다.
// ─────────────────────────────────────────────────────────────

export const profile = {
  nameKo: '김정호',
  nameEn: 'Jeongho Kim',
  wordmark: 'JEONGHO KIM',
  /** 글 섹션 이름 (Threads 계정명과 같은 이름) */
  logName: 'jeongho.log',

  /**
   * 한 줄 소개 — 브리프의 임시 초안입니다. 실제 사용할 문구로 확정해 주세요.
   * 확인되지 않은 경력 표현은 넣지 않았습니다.
   */
  tagline: '커피, 공간, 제품과 기술. 보고, 써보고, 다시 생각한 것을 기록합니다.',
  taglineEn: 'Notes on coffee, places, products, and technology.',

  /** 관심 분야. 홈 화면에 칩으로 표시됩니다. */
  interests: ['커피', '공간', '제품', '기술'],

  /** 소개 문단. 비워 두면 "소개" 섹션이 숨겨집니다. 한 항목이 한 문단입니다. */
  bio: [] as string[],

  /** 다른 이름(예: Jay Jeongho Kim). 실제로 공개 사용이 확인된 것만 추가하세요. */
  aliases: [] as string[],

  /**
   * 공식 계정 링크. 본인 계정의 정확한 URL 을 확인한 뒤에만 추가하세요.
   * 추가하면 홈 화면, 푸터, JSON-LD 의 sameAs 에 함께 반영됩니다.
   *
   * { label: 'Instagram', url: 'https://www.instagram.com/...' },
   * { label: 'Threads',   url: 'https://www.threads.com/@...' },
   * { label: 'LinkedIn',  url: 'https://www.linkedin.com/in/...' },
   */
  links: [
    { label: 'Instagram', url: 'https://www.instagram.com/jay.jeongho/' },
  ] as OfficialLink[],
};

/** https URL 이 채워진 링크만 공개 화면에 사용합니다. */
export function isHttpsUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    return new URL(value.trim()).protocol === 'https:';
  } catch {
    return false;
  }
}

export const officialLinks = profile.links.filter((link) => link.label.trim() && isHttpsUrl(link.url));
export const displayName = `${profile.nameKo} / ${profile.nameEn}`;
