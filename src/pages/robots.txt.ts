import type { APIRoute } from 'astro';
import { isPublic } from '../../site.config.mjs';
import { absoluteUrl } from '../lib/url';

// 하위 경로(/whoru 등)에 배포하면 이 파일은 도메인 루트가 아니어서 크롤러가 읽지 않습니다.
// 그 경우 각 페이지의 <meta name="robots"> 가 실제로 작동하는 설정입니다.
export const GET: APIRoute = () => {
  const body = isPublic
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml')}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
