import { getCollection } from 'astro:content';

/**
 * 공개할 글을 최신순으로 반환합니다.
 * 초안(draft: true)은 빌드에서 제외하고, 개발 서버(npm run dev)에서만 미리보기로 보여 줍니다.
 */
export async function getPosts() {
  const posts = await getCollection('log', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export type Post = Awaited<ReturnType<typeof getPosts>>[number];
