import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const log = defineCollection({
  // 파일 이름이 주소(slug)가 됩니다. "_" 로 시작하는 파일은 글로 취급하지 않습니다.
  loader: glob({ base: './src/content/log', pattern: '**/[^_]*.md' }),
  schema: z
    .object({
      title: z.string().min(1),
      /** 목록, 검색 결과, 공유 미리보기에 쓰이는 한두 문장 */
      description: z.string().min(1),
      /** 파일 이름 대신 주소를 직접 정하고 싶을 때만. 영문 소문자·숫자·하이픈 */
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.')
        .optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** true 면 공개 경로·목록·sitemap 에서 제외됩니다. (npm run dev 에서는 미리볼 수 있습니다) */
      draft: z.boolean().default(false),
      /** 이 글의 출발점이 된 Threads 글 주소 */
      sourceThreadUrl: z.url().optional(),
    })
    .refine((post) => !post.updatedAt || post.updatedAt >= post.publishedAt, {
      message: 'updatedAt 은 publishedAt 보다 빠를 수 없습니다.',
      path: ['updatedAt'],
    }),
});

export const collections = { log };
