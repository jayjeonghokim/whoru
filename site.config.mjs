// 사이트 주소와 공개 모드를 한 곳에서 관리합니다.
// astro.config.mjs, src/, scripts/verify-build.mjs 가 모두 이 파일을 읽습니다.
//
//   SITE_MODE  public | preview (기본 preview)
//              preview: noindex, canonical·sitemap 없음, robots.txt 는 전체 차단
//              public : 색인 허용, canonical·sitemap 출력, 주소가 미확정이면 빌드 실패
//   SITE_URL   사이트 origin. 예) https://jeongho.example  (경로 제외)
//   BASE_PATH  하위 경로에 배포할 때만. 예) /whoru  (GitHub Pages 프로젝트 사이트)

export const PLACEHOLDER_URL = 'https://example.com';

const mode = process.env.SITE_MODE || 'preview';
if (mode !== 'public' && mode !== 'preview') {
  throw new Error(`SITE_MODE 는 "public" 또는 "preview" 여야 합니다. (받은 값: "${mode}")`);
}

export const siteMode = mode;
export const isPublic = mode === 'public';
export const siteUrl = (process.env.SITE_URL || PLACEHOLDER_URL).replace(/\/+$/, '');

const rawBase = (process.env.BASE_PATH || '').trim().replace(/^\/+|\/+$/g, '');
export const basePath = rawBase ? `/${rawBase}` : '';

if (isPublic) {
  const { protocol, hostname } = new URL(siteUrl);
  const reserved = /(^|\.)(example\.(com|org|net)|localhost)$/.test(hostname);
  if (protocol !== 'https:' || reserved) {
    throw new Error(
      `SITE_MODE=public 으로 빌드하려면 실제 공개 주소(https)가 필요합니다. SITE_URL 을 확인하세요. (현재: ${siteUrl})`,
    );
  }
}
