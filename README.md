# 김정호 / Jeongho Kim — 개인 홈페이지

이름, 소개, 활동, 글(`jeongho.log`), 공식 링크를 한곳에 모으는 작은 정적 사이트입니다.
Instagram·Threads·LinkedIn이 각자의 역할을 하고, 이 사이트는 **공식 프로필과 원본 기록의 기준점**이 됩니다.

- Astro 7 + TypeScript + Markdown, CMS·데이터베이스·회원가입 없음
- 핵심 내용은 빌드 시점에 HTML로 완성되어 JavaScript 없이도 읽힙니다
- 한국어 우선, 모바일 우선, 외부 폰트·스크립트·추적 코드 없음

## 지금 상태

**아직 공개할 사실이 채워지지 않은 골격입니다.** 의도한 동작입니다.

| 영역 | 상태 |
|---|---|
| 이름 `김정호 / Jeongho Kim`, 글 섹션 `jeongho.log` | 브리프의 기본 표기 |
| 한 줄 소개 | 브리프의 **임시 초안**입니다. 확정 문구로 바꿔 주세요 |
| 공식 링크(Instagram·Threads·LinkedIn) | 비어 있음 → 화면에 나타나지 않음 |
| 경력·프로젝트·소개 문단 | 비어 있음 → 섹션 자체가 숨겨짐 |
| 글 | 없음 → `/log/` 에 빈 상태 안내만 표시 |
| 배포 모드 | 기본 **미리보기(noindex)** |

확인되지 않은 경력·계정·도메인을 사실처럼 공개하지 않도록, 값이 비어 있으면 렌더링하지 않습니다.

## 빠른 시작

Node.js 22.12 이상이 필요합니다.

```bash
npm ci            # 처음 한 번
npm run dev       # 개발 서버 http://localhost:4321 (초안 글도 미리보기로 보임)
npm test          # 타입 검사 → 빌드 → 결과 검증. 배포 전에 실행하세요
```

## 내용 채우기

모든 공개 내용은 `src/data/` 와 `src/content/log/` 에 있습니다.

### 프로필 — `src/data/profile.ts`

- `tagline` / `taglineEn`: 한 줄 소개. 홈 화면, `<meta description>`, 공유 미리보기에 쓰입니다.
- `interests`: 관심 분야 칩.
- `bio`: 소개 문단 배열. 한 항목이 한 문단이며, 비워 두면 "소개" 섹션이 숨겨집니다.
- `links`: 공식 계정. **본인 계정의 정확한 URL을 확인한 뒤에만** 추가하세요. 핸들로 URL을 추측하지 마세요.
  추가하면 홈 화면, 푸터, 구조화 데이터(`sameAs`)에 함께 반영됩니다.
- `aliases`: `Jay Jeongho Kim` 같은 다른 이름. 실제 공개 사용이 확인된 것만 추가하세요.

### 경력·프로젝트 — `src/data/experience.ts`, `src/data/projects.ts`

각 항목에 `title`, `period`, `role`, (선택) `summary`, `sourceUrl`(근거 링크)을 적습니다.
파일 안에 형식 예시가 주석으로 있습니다. **검증된 사실만** 넣으세요. 비어 있으면 섹션이 숨겨집니다.

### 글 추가 — `src/content/log/`

1. `src/content/log/_template.md` 를 같은 폴더에 **영문 소문자-하이픈 이름**으로 복사합니다. 파일 이름이 주소가 됩니다.
   예) `why-i-measure-water.md` → `/log/why-i-measure-water/`
2. 맨 위 `---` 사이의 값을 채웁니다.

   | 필드 | 설명 |
   |---|---|
   | `title`, `description` | 필수. `description` 은 목록·검색 결과·공유 미리보기에 쓰입니다 |
   | `publishedAt` | 필수. `2026-10-01` 형식 (한국 시간 기준으로 표시) |
   | `updatedAt` | 내용을 고쳤을 때만. 무엇이 바뀌었는지 본문 끝에 적어 두세요 |
   | `tags` | 선택. `[커피, 공간]` |
   | `slug` | 선택. 파일 이름 대신 주소를 직접 정할 때 |
   | `sourceThreadUrl` | 선택. 출발점이 된 Threads 글 주소 |
   | `draft` | `true` 면 공개되지 않음 |

3. 본문은 `##` 제목부터 시작합니다. 페이지 제목이 `#` 한 개를 이미 사용합니다.
   권장 흐름은 관찰 → 질문 → 근거·경험 → 현재 생각 → 남은 질문입니다.
4. 저자는 항상 프로필의 `김정호 / Jeongho Kim` 으로 표시되고 구조화 데이터에도 같은 식별자로 연결됩니다.

본문의 내부 링크(`[이전 글](/log/other-post/)`, `![](/images/a.png)`)는 배포 경로(`BASE_PATH`)가 **자동으로 붙습니다.** 하위 경로에서 커스텀 도메인으로 옮겨도 글을 고칠 필요가 없습니다.
이미지는 `public/images/` 에 넣고 대체 텍스트를 꼭 적으세요: `![커피를 추출하는 모습](/images/brew.jpg)`

### 초안 → 공개

초안은 `draft: true` 로 두고 `npm run dev` 에서 미리 봅니다("초안" 배지가 붙습니다).
공개할 준비가 되면 `draft: false` 로 바꾸고 커밋·푸시합니다. 초안은 빌드 결과, 목록, sitemap 어디에도 들어가지 않습니다.

## 공개 모드와 주소

주소와 공개 여부는 환경 변수 세 개로만 정하며, 코드는 `site.config.mjs` 한 곳에서 읽습니다.

| 변수 | 값 | 의미 |
|---|---|---|
| `SITE_MODE` | `preview`(기본) | `noindex`, canonical·sitemap 없음, `robots.txt` 전체 차단 |
| | `public` | 색인 허용, canonical·sitemap·`robots.txt`(Allow) 출력 |
| `SITE_URL` | `https://내도메인` | 사이트 origin (경로 제외) |
| `BASE_PATH` | `/whoru` | 하위 경로에 배포할 때만. 루트면 비워 두거나 `/` (GitHub 변수에서는 비우면 `/저장소이름` 이 적용되므로 반드시 `/`) |

**`public` 모드는 실제 https 주소가 없으면 빌드가 실패합니다.** `example.com` 같은 예약 도메인이 공개 결과물에 남을 수 없습니다.

```bash
# 공개 빌드를 로컬에서 시험해 보기
SITE_MODE=public SITE_URL=https://내도메인 npm test
npm run preview
```

> `noindex` 는 검색 엔진에 "색인하지 말라"고 요청하는 것일 뿐 **접근 제한이 아닙니다.** 주소를 아는 사람은 누구나 볼 수 있습니다.

## GitHub Pages로 배포

`.github/workflows/deploy.yml` 이 PR·푸시마다 `check → build → verify` 를 실행하고, **기본 브랜치에서만** Pages로 배포합니다.

### 처음 한 번만 (GitHub 웹에서)

1. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 선택합니다.
2. 기본 브랜치(`main`)에 코드를 반영하면 배포가 시작됩니다.
   주소는 `https://<GitHub 사용자명>.github.io/<저장소 이름>/` 입니다.

이 단계에서는 `SITE_MODE=preview` 라서 **noindex** 상태로 올라갑니다.

### 공개로 전환

아래 "공개 전 확인할 사실"을 채운 뒤, **Settings → Secrets and variables → Actions → Variables** 에서 저장소 변수를 추가합니다.

| 변수 | 값 |
|---|---|
| `SITE_MODE` | `public` |
| `SITE_URL` | 기본 주소를 쓰면 생략. 커스텀 도메인이면 `https://내도메인` |
| `BASE_PATH` | 기본 주소를 쓰면 생략. 커스텀 도메인이면 `/` |

그 뒤 **Actions → Build & Deploy → Run workflow** 로 다시 배포합니다.

### 커스텀 도메인으로 옮길 때

1. 도메인 구매·DNS 설정은 이 저장소가 하지 않습니다. GitHub Pages 문서의 "Configuring a custom domain" 순서를 따르세요.
2. **Settings → Pages → Custom domain** 에 도메인을 입력합니다. (Actions 로 배포할 때는 `CNAME` 파일이 아니라 이 설정이 기준입니다.)
3. 위 표대로 저장소 변수 `SITE_URL=https://내도메인.com`, `BASE_PATH=/` 를 설정하고 다시 배포합니다.
4. 글과 데이터는 고칠 필요가 없습니다. 주소는 `site.config.mjs` 한 곳에서만 바뀝니다.

> 하위 경로(`/whoru`)로 배포하는 동안에는 `robots.txt` 가 도메인 루트가 아니어서 크롤러가 읽지 않습니다.
> 이때 실제로 작동하는 것은 각 페이지의 `<meta name="robots">` 입니다.

## 공개 전 확인할 사실

개발은 기본값으로 진행했고, 공개 전에 아래만 한 번에 확보하면 됩니다.

1. **이름과 소개** — `김정호 / Jeongho Kim` 표기가 맞는지, 실제 사용할 한 줄 소개 (`tagline`)
2. **공식 연결 주소** — Instagram / Threads / LinkedIn의 정확한 URL, 실제 사용할 도메인
3. **공개할 사실** — 현재 역할·소속, 대표 경력·프로젝트·발표와 근거 링크, 공개 가능 범위

미확인 항목을 숨긴 채 공개하는 것도 가능합니다. 비어 있는 값은 화면에 나타나지 않습니다.

## `npm run verify` 가 확인하는 것

`npm test` 가 빌드 결과(`dist/`)를 자동으로 검사합니다. 하나라도 어긋나면 실패합니다.

- 필수 페이지(`/`, `/log/`, `404`, `robots.txt`)와 한국어 `lang`, `<title>`, description, `<h1>` 1개
- 모드별 설정: 공개는 canonical이 페이지 주소와 일치·색인 허용, 미리보기는 `noindex`·canonical 없음·sitemap 없음
- 구조화 데이터(JSON-LD) 파싱, `Person` 식별자 일관성, 글의 `author` 가 같은 `Person` 참조, `sameAs` 가 화면의 링크와 일치, 날짜가 화면의 `<time>` 과 일치
- 내부 링크·앵커 깨짐, `BASE_PATH` 누락
- 초안이 빌드 결과에 새지 않았는지
- sitemap 이 게시된 페이지와 정확히 일치하는지, 공개 빌드에 `example.com` 이 남지 않았는지

## 폴더 구조

```text
site.config.mjs          주소·공개 모드 (한 곳에서 관리)
astro.config.mjs
plugins/                 Markdown 내부 링크에 BASE_PATH 를 붙이는 rehype 플러그인
scripts/verify-build.mjs 빌드 결과 검증
src/
  data/                  profile.ts · experience.ts · projects.ts   ← 여기를 수정
  content/log/           Markdown 글                                  ← 글은 여기에
  content.config.ts      글 필드 스키마와 검증
  components/ layouts/   화면 조각, 메타데이터·JSON-LD 를 담당하는 레이아웃
  pages/                 index · log/index · log/[slug] · 404 · robots.txt
  lib/                   URL·날짜·JSON-LD 헬퍼
  styles/global.css      색상·타이포그래피 (맨 위 CSS 변수)
docs/ai-recognition-log.md  검색·AI 인식 점검 기록 양식
```

## 알아 둘 점

- **글이 없을 때 빌드 로그에 `collection "log" does not exist or is empty` 경고**가 나옵니다. 정상이며 첫 글을 올리면 사라집니다.
- Astro 7의 기본 Markdown 처리기(Sätteri)는 rehype 플러그인을 쓰려면 별도 패키지가 필요해, 내부 링크 플러그인을 위해 `@astrojs/markdown-remark` 의 `unified()` 를 사용합니다.
- 구조화 데이터와 sitemap 은 검색 순위나 AI 인용을 **보장하지 않습니다.** 사람과 검색·AI가 같은 사실을 정확하게 읽을 수 있게 하는 기반입니다.
- 색상을 바꾸려면 `src/styles/global.css` 맨 위 `:root` 변수를 수정하세요. 텍스트 색 조합은 WCAG AA 대비(4.5:1)를 만족하도록 골랐으니, 바꾼 뒤에도 대비를 확인하세요.

## 아직 하지 않은 것 (우선순위순)

- **P1** 실제 글·활동·공식 링크 반영, RSS, 공유 이미지(`og:image`)와 favicon 정리, 실제 공개 후 검색 도구 등록(사이트 소유자가 직접), 배포 환경 확인
- **P2** `/about/`·`/experience/`·`/projects/`·`/talks/` 분리(자료가 늘어난 뒤), 영어 소개 페이지(번역이 실제로 있을 때만 언어별 메타데이터 적용), 선택적 측정 도구, `llms.txt` 실험(기본 HTML·정확성·구조화 데이터보다 우선하지 않음), 분기별 검색·AI 인식 점검 → [기록 양식](docs/ai-recognition-log.md)
