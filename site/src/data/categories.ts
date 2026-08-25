import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

export type { Category } from 'stack-site-builder/lib/category-tree';

/**
 * `stacks` 컬렉션(테마 코어 도구 카탈로그)의 분류 체계 — 이 사이트에서는
 * "실습 환경" 카탈로그로 쓴다. 수업에서 실제로 깔고 쓰는 것만 담는다.
 * 홈은 cards 템플릿이라 카탈로그 홈을 거치지 않고, 홈의 "실습 환경" 카드가
 * 부모 카테고리 페이지(`/categories/env/`)로 연결한다.
 */
const categories: Category[] = [
  {
    id: 'env',
    label: { ko: '실습 환경' },
    description: { ko: '수업과 과제에서 실제로 쓰는 도구' },
    detail: {
      ko: '실습 코드는 의사코드 하나에 C와 Python 두 구현이 붙습니다. 둘 다 돌릴 수 있으면 준비는 끝입니다.',
    },
    children: [
      {
        id: 'toolchain',
        label: { ko: '언어와 컴파일러' },
        description: { ko: '실습 코드를 빌드하고 실행하는 데 필요한 것' },
      },
      {
        id: 'workflow',
        label: { ko: '작업 도구' },
        description: { ko: '코드를 쓰고, 버전을 남기고, 제출하는 데 쓰는 것' },
      },
    ],
  },
];

/** Top-level categories (homepage sections), in display order. */
export const rootCategories = categories;

const tree = buildTree(categories);

/** Every node by id (top-level and nested). */
export const categoryMap = tree.map;

/** All category ids, for static path generation. */
export const allCategoryIds = tree.allIds;

/** Root → node chain for an id (its breadcrumb path). Empty if unknown. */
export const pathOf = tree.pathOf;

/** Direct children of a node (empty for leaves). */
export const childrenOf = tree.childrenOf;

/** A node's id plus all of its descendants' ids (for subtree roll-up). */
export const descendantIds = tree.descendantIds;

/** The top-level ancestor id of a node (itself if already top-level). */
export function rootIdOf(id: string): string {
  const path = pathOf(id);
  return path.length ? path[0].id : id;
}
