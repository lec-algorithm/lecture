import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `concepts` 컬렉션의 분류 체계.
 *
 * concepts 섹션은 site.ts에서 꺼져 있고 콘텐츠도 없다. 개념 설명은 주제별
 * 강의 문서 안에 두고, 짧은 정의는 용어집이 맡는다. 그래도 이 파일은
 * 지워선 안 된다 — 테마의 Glossary 컴포넌트가 섹션 토글과 무관하게 여기를
 * import한다. 개념 문서를 따로 쓰기 시작하면 site.ts의 `concepts`를 켜면 된다.
 */
export const conceptCategories: Category[] = [
  {
    id: 'concept-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 개념',
    },
  },
];

export const conceptTree = buildTree(conceptCategories);

/** Id of the fallback category that holds concepts without a real category. */
export const UNCATEGORIZED_CONCEPT = 'concept-uncategorized';

/** Resolve a concept's `category` to a real tree id (unknown → uncategorized). */
export const conceptCatOf = (category?: string | null): string =>
  category && conceptTree.map.has(category) ? category : UNCATEGORIZED_CONCEPT;
