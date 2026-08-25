import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `articles` 컬렉션의 분류 체계 — 공지·안내·과제·강의 노트.
 */
export const articleCategories: Category[] = [
  {
    id: 'notice',
    label: { ko: '공지' },
    description: {
      ko: '휴강·보강, 시험 안내 등 수업 운영 공지',
    },
  },
  {
    id: 'guide',
    label: { ko: '안내' },
    description: {
      ko: '개발 환경 준비, 저장소 사용법, 제출 규격 안내',
    },
  },
  {
    id: 'assignment',
    label: { ko: '과제' },
    description: {
      ko: '과제와 개인프로젝트 안내, 평가 기준',
    },
  },
  {
    id: 'lecture-note',
    label: { ko: '강의 노트' },
    description: {
      ko: '수업 후 정리하는 보충 설명과 자주 나온 질문',
    },
  },
  {
    id: 'article-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 글',
    },
  },
];

export const articleTree = buildTree(articleCategories);

/** Id of the fallback category that holds articles without a real category. */
export const UNCATEGORIZED_ARTICLE = 'article-uncategorized';

/** Resolve an article's `category` to a real tree id (unknown → uncategorized). */
export const articleCatOf = (category?: string | null): string =>
  category && articleTree.map.has(category) ? category : UNCATEGORIZED_ARTICLE;
