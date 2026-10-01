import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { basePath, isPublic, siteUrl } from './site.config.mjs';
import rehypePrefixBase from './plugins/rehype-prefix-base.mjs';

export default defineConfig({
  site: siteUrl,
  base: basePath || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // sitemap 은 공개 모드에서만 만들어 미리보기 주소가 검색에 노출되지 않게 한다.
  integrations: isPublic ? [sitemap()] : [],
  markdown: { processor: unified({ rehypePlugins: [[rehypePrefixBase, { base: basePath }]] }) },
  devToolbar: { enabled: false },
});
