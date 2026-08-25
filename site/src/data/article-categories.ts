import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `articles` 컬렉션의 분류 체계 — 공지·안내·과제·강의 노트.
 */
export const articleCategories: Category[] = [
  {
    id: 'notice',
    label: { ko: '공지', en: 'Notices', zh: '公告' },
    description: {
      ko: '휴강·보강, 시험 안내 등 수업 운영 공지',
      en: 'Class notices: cancellations, make-up sessions, exam information',
      zh: '停课与补课、考试通知等课程运营公告',
    },
  },
  {
    id: 'guide',
    label: { ko: '안내', en: 'Guides', zh: '指南' },
    description: {
      ko: '개발 환경 준비, 저장소 사용법, 제출 규격 안내',
      en: 'Setting up the environment, using the repositories, submission rules',
      zh: '开发环境准备、仓库使用方法、提交规范',
    },
  },
  {
    id: 'assignment',
    label: { ko: '과제', en: 'Assignments', zh: '作业' },
    description: {
      ko: '과제와 개인프로젝트 안내, 평가 기준',
      en: 'Assignment and project briefs, grading criteria',
      zh: '作业与个人项目说明、评分标准',
    },
  },
  {
    id: 'lecture-note',
    label: { ko: '강의 노트', en: 'Lecture notes', zh: '课堂笔记' },
    description: {
      ko: '수업 후 정리하는 보충 설명과 자주 나온 질문',
      en: 'Follow-up explanations and frequently asked questions after class',
      zh: '课后整理的补充说明与常见问题',
    },
  },
  {
    id: 'article-uncategorized',
    label: { ko: '미분류', en: 'Uncategorized', zh: '未分类' },
    description: {
      ko: '아직 분류에 들어가지 않은 글',
      en: 'Posts not yet filed under a category',
      zh: '尚未归类的文章',
    },
  },
];

export const articleTree = buildTree(articleCategories);

/** Id of the fallback category that holds articles without a real category. */
export const UNCATEGORIZED_ARTICLE = 'article-uncategorized';

/** Resolve an article's `category` to a real tree id (unknown → uncategorized). */
export const articleCatOf = (category?: string | null): string =>
  category && articleTree.map.has(category) ? category : UNCATEGORIZED_ARTICLE;
