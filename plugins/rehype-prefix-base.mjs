// Markdown 본문의 내부 링크("/log/foo/", "/images/a.png")에 BASE_PATH 를 자동으로 붙입니다.
// 하위 경로(/whoru)에서 커스텀 도메인으로 옮겨도 글을 고칠 필요가 없게 하기 위함입니다.
export default function rehypePrefixBase({ base = '' } = {}) {
  const needsPrefix = (value) =>
    typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && value !== base && !value.startsWith(`${base}/`);

  function walk(node) {
    if (node.type === 'element' && node.properties) {
      for (const attr of ['href', 'src']) {
        if (needsPrefix(node.properties[attr])) node.properties[attr] = `${base}${node.properties[attr]}`;
      }
    }
    node.children?.forEach(walk);
  }

  return (tree) => {
    if (base) walk(tree);
  };
}
