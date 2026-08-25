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
    label: { ko: '실습 환경', en: 'Lab environment', zh: '实验环境' },
    description: {
      ko: '수업과 과제에서 실제로 쓰는 도구',
      en: 'The tools actually used in class and in assignments',
      zh: '课堂与作业中实际使用的工具',
    },
    detail: {
      ko: 'Codespaces로 실습하면 설치할 것이 없습니다. 로컬에서 하려면 Git과 Docker 둘만 깔면 되고, 컴파일러와 Python은 컨테이너 안에 들어 있습니다.',
      en: 'With Codespaces there is nothing to install. Locally you only need Git and Docker; the compiler and Python live inside the container.',
      zh: '使用 Codespaces 无需安装任何东西。若在本地运行，只需 Git 与 Docker，编译器和 Python 都在容器内。',
    },
    children: [
      {
        id: 'runtime',
        label: { ko: '실행 환경', en: 'Runtime', zh: '运行环境' },
        description: {
          ko: '실습 코드가 도는 컨테이너. 이것만 설치하면 된다',
          en: 'The container the practice code runs in. The only thing to install',
          zh: '实验代码运行的容器。唯一需要安装的东西',
        },
      },
      {
        id: 'toolchain',
        label: { ko: '언어', en: 'Languages', zh: '语言' },
        description: {
          ko: '컨테이너 안에서 실습 코드를 빌드하고 실행하는 것',
          en: 'What builds and runs the practice code inside the container',
          zh: '在容器内构建并运行实验代码的工具',
        },
      },
      {
        id: 'workflow',
        label: { ko: '작업 도구', en: 'Workflow', zh: '工作流工具' },
        description: {
          ko: '코드를 쓰고, 버전을 남기고, 제출하는 데 쓰는 것',
          en: 'What you write code with, keep history in, and submit through',
          zh: '用于编写代码、保留版本并提交的工具',
        },
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
