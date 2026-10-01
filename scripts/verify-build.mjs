// 빌드 결과(dist/)가 브리프의 완료 기준을 지키는지 확인합니다.
//   npm run build && npm run verify
// SITE_MODE / SITE_URL / BASE_PATH 는 빌드할 때와 같은 값을 주어야 합니다.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PLACEHOLDER_URL, basePath, isPublic, siteMode, siteUrl } from '../site.config.mjs';

const DIST = 'dist';
const errors = [];
const fail = (message) => errors.push(message);

if (!existsSync(DIST)) {
  console.error('dist/ 가 없습니다. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const read = (file) => readFileSync(file, 'utf8');
const rel = (file) => relative(DIST, file);

/** dist 안의 html 파일 → 공개 URL 경로. index.html → "/", log/index.html → "/log/" */
const routeOf = (file) => `/${rel(file).replace(/(^|\/)index\.html$/, '$1')}`;

// 1) 필수 파일
for (const required of ['index.html', 'log/index.html', '404.html', 'robots.txt', 'favicon.svg']) {
  if (!existsSync(join(DIST, required))) fail(`필수 파일 없음: ${required}`);
}

const personId = `${siteUrl}${basePath}/#person`;
const homeHtml = existsSync(join(DIST, 'index.html')) ? read(join(DIST, 'index.html')) : '';
const homeLinks = new Set([...homeHtml.matchAll(/<a [^>]*href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]));

for (const file of htmlFiles) {
  const html = read(file);
  const name = rel(file);
  const route = routeOf(file);
  const is404 = name === '404.html';

  // 2) 기본 마크업
  if (!/<html lang="ko"/.test(html)) fail(`${name}: <html lang="ko"> 없음`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: <title> 없음`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${name}: description 없음`);
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(`${name}: h1 이 ${h1Count}개 (1개여야 함)`);

  // 3) 모드별 색인·canonical 설정
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (isPublic) {
    if (is404) {
      if (!noindex) fail(`${name}: 404 는 noindex 여야 함`);
    } else {
      if (noindex) fail(`${name}: 공개 모드인데 noindex`);
      const expected = `${siteUrl}${basePath}${route}`;
      if (canonical !== expected) fail(`${name}: canonical 이 ${canonical ?? '(없음)'} — 기대값 ${expected}`);
    }
  } else {
    if (!noindex) fail(`${name}: 미리보기 모드인데 noindex 없음`);
    if (canonical) fail(`${name}: 미리보기 모드인데 canonical 이 있음`);
  }

  // 4) JSON-LD — 파싱, Person 식별자 일관성, 화면과의 일치
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) {
    fail(`${name}: JSON-LD 블록이 ${blocks.length}개 (1개여야 함)`);
    continue;
  }
  let graph;
  try {
    graph = JSON.parse(blocks[0][1])['@graph'];
  } catch (error) {
    fail(`${name}: JSON-LD 파싱 실패 (${error.message})`);
    continue;
  }
  const byType = (type) => graph.filter((node) => node['@type'] === type);
  const [person] = byType('Person');
  if (byType('Person').length !== 1 || person['@id'] !== personId) fail(`${name}: Person @id 가 ${personId} 가 아님`);
  if (byType('WebSite').length !== 1) fail(`${name}: WebSite 노드가 1개가 아님`);
  for (const url of person?.sameAs ?? []) {
    if (!homeLinks.has(url)) fail(`${name}: sameAs ${url} 가 홈 화면의 링크에 없음`);
  }
  for (const page of byType('WebPage')) {
    if (page.url !== `${siteUrl}${basePath}${route}`) fail(`${name}: WebPage url(${page.url}) 이 페이지 주소와 다름`);
  }
  const posts = byType('BlogPosting');
  const isPost = route.startsWith('/log/') && route !== '/log/';
  if (isPost !== (posts.length === 1)) fail(`${name}: BlogPosting 노드 수가 ${posts.length}개 (글 상세에만 1개)`);
  for (const post of posts) {
    if (post.author?.['@id'] !== personId) fail(`${name}: BlogPosting author 가 Person 을 참조하지 않음`);
    if (!/^\d{4}-\d{2}-\d{2}/.test(post.datePublished ?? '')) fail(`${name}: datePublished 형식 오류`);
    if (!html.includes(`datetime="${post.datePublished}"`)) fail(`${name}: datePublished 가 화면의 <time> 과 다름`);
  }

  // 5) 내부 링크가 실제 파일로 이어지는지
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (!html.includes(`id="${href.slice(1)}"`)) fail(`${name}: 앵커 ${href} 의 대상 id 없음`);
      continue;
    }
    if (!href.startsWith('/')) continue;
    const path = href.split(/[?#]/)[0];
    if (basePath && !path.startsWith(`${basePath}/`)) {
      fail(`${name}: 링크 ${href} 에 base(${basePath}) 가 빠짐`);
      continue;
    }
    const local = path.slice(basePath.length);
    const target = local.endsWith('/') ? join(DIST, local, 'index.html') : join(DIST, local);
    if (!existsSync(target)) fail(`${name}: 깨진 내부 링크 ${href}`);
  }
}

// 6) 초안이 공개 결과에 새지 않았는지 (제목이 dist 어디에도 없어야 함)
const contentDir = 'src/content/log';
const drafts = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => read(join(contentDir, file)))
      .filter((text) => /^draft:\s*true\s*(#.*)?$/m.test(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''))
      .map((text) => text.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1])
      .filter(Boolean)
  : [];
const publicText = files.filter((file) => /\.(html|xml|txt)$/.test(file)).map(read).join('\n');
for (const title of drafts) {
  if (publicText.includes(title)) fail(`초안 "${title}" 이 빌드 결과에 포함됨`);
}

// 7) 모드별 sitemap / robots, 미확정 도메인 잔존 여부
const robots = existsSync(join(DIST, 'robots.txt')) ? read(join(DIST, 'robots.txt')) : '';
const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(file));
if (isPublic) {
  if (!robots.includes(`Sitemap: ${siteUrl}${basePath}/sitemap-index.xml`)) fail('robots.txt 에 Sitemap 줄이 없음');
  const sitemapUrls = sitemapFiles.flatMap((file) => [...read(file).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const expected = htmlFiles
    .filter((file) => rel(file) !== '404.html')
    .map((file) => `${siteUrl}${basePath}${routeOf(file)}`)
    .sort();
  const actual = sitemapUrls.filter((url) => !url.endsWith('.xml')).sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    fail(`sitemap 의 주소 목록이 게시된 페이지와 다름\n    기대: ${expected.join(', ')}\n    실제: ${actual.join(', ')}`);
  }
  if (publicText.includes(new URL(PLACEHOLDER_URL).hostname)) fail(`공개 빌드에 예약 도메인(${PLACEHOLDER_URL})이 남아 있음`);
} else {
  if (!/Disallow:\s*\/\s*$/m.test(robots)) fail('미리보기 모드의 robots.txt 는 전체 차단이어야 함');
  if (sitemapFiles.length > 0) fail('미리보기 모드에서는 sitemap 을 만들지 않아야 함');
}

if (errors.length > 0) {
  console.error(`✗ verify 실패 (${siteMode} 모드, ${errors.length}건)`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`✓ verify 통과 — ${siteMode} 모드, 페이지 ${htmlFiles.length}개, ${siteUrl}${basePath || ''}`);
