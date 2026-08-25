import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `courses` 컬렉션의 분류 체계 — 주제 14개를 성격별로 묶는다.
 * 주차(진도)와는 다른 축이다. 대응표는 docs/course-plan.md 참고
 */
export const courseCategories: Category[] = [
  {
    id: 'foundations',
    label: { ko: '기초와 분석' },
    description: {
      ko: '알고리즘을 보는 눈: 탐색, 재귀와 반복, 실행시간 측정과 점근 표기법',
    },
  },
  {
    id: 'sorting',
    label: { ko: '정렬' },
    description: {
      ko: '기본 정렬부터 분할 정복, 퀵 정렬, 기수 정렬까지',
    },
  },
  {
    id: 'data-structures',
    label: { ko: '자료구조' },
    description: {
      ko: '이진 탐색 트리, 해시 테이블, 트라이. 저장 방식이 성능을 결정하는 자리',
    },
  },
  {
    id: 'graphs',
    label: { ko: '그래프' },
    description: {
      ko: '그래프 표현과 탐색, 최소 스패닝 트리, 최단 경로',
    },
  },
  {
    id: 'strategies',
    label: { ko: '설계 전략' },
    description: {
      ko: '그리디와 동적 계획법. 같은 문제를 어떤 틀로 푸는가',
    },
  },
  {
    id: 'applied',
    label: { ko: '응용' },
    description: {
      ko: '정규식과 오토마타, 클러스터링, 추천처럼 알고리즘이 제품에 닿는 지점',
    },
  },
  {
    id: 'course-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 강의',
    },
  },
];

export const courseTree = buildTree(courseCategories);

/** Validation map for content.config.ts (strict category ids at build time). */
export const courseCategoryMap = courseTree.map;

/** Id of the fallback category that holds courses without a real category. */
export const UNCATEGORIZED_COURSE = 'course-uncategorized';

/** Resolve a course's `category` to a real tree id (unknown → uncategorized). */
export const courseCatOf = (category?: string | null): string =>
  category && courseTree.map.has(category) ? category : UNCATEGORIZED_COURSE;
