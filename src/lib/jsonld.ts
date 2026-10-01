import { displayName, officialLinks, profile } from '../data/profile';
import { absoluteUrl } from './url';

// 구조화 데이터는 화면에 표시한 사실과 일치해야 합니다.
// 확인되지 않은 직함·소속·수상은 추가하지 않습니다.

export const personId = () => `${absoluteUrl('/')}#person`;
export const websiteId = () => `${absoluteUrl('/')}#website`;

export function personNode() {
  return {
    '@type': 'Person',
    '@id': personId(),
    name: profile.nameKo,
    alternateName: [profile.nameEn, ...profile.aliases],
    url: absoluteUrl('/'),
    ...(officialLinks.length > 0 && { sameAs: officialLinks.map((link) => link.url) }),
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: displayName,
    url: absoluteUrl('/'),
    inLanguage: 'ko',
  };
}

interface WebPageInput {
  path: string;
  title: string;
  description: string;
  /** 사람 소개 페이지(홈)이면 true */
  aboutPerson?: boolean;
}

export const webPageId = (path: string) => `${absoluteUrl(path)}#webpage`;

export function webPageNode({ path, title, description, aboutPerson }: WebPageInput) {
  return {
    '@type': 'WebPage',
    '@id': webPageId(path),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: 'ko',
    isPartOf: { '@id': websiteId() },
    ...(aboutPerson && { about: { '@id': personId() } }),
  };
}

interface BlogPostingInput {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
}

export function blogPostingNode({ path, title, description, publishedAt, updatedAt, tags }: BlogPostingInput) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    inLanguage: 'ko',
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    author: { '@id': personId() },
    isPartOf: { '@id': websiteId() },
    mainEntityOfPage: { '@id': webPageId(path) },
  };
}

/** <script type="application/ld+json"> 안에 안전하게 넣을 수 있는 문자열 */
export function serializeGraph(nodes: object[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
