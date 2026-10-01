import { basePath, siteUrl } from '../../site.config.mjs';

/** 내부 경로("/log/")를 base 가 붙은 경로로 바꿉니다. */
export function withBase(path = '/'): string {
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 내부 경로를 공개 주소 기준 절대 URL 로 바꿉니다. */
export function absoluteUrl(path = '/'): string {
  return `${siteUrl}${withBase(path)}`;
}
