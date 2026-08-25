import type { SectionKey } from 'stack-site-builder';

/**
 * 사이트 정체성 — 테마가 `@aas-data/site` alias로 읽어간다.
 * UI 문자열 오버라이드 키는 테마의 src/i18n/ui.ts와 동일하다.
 */
export const site = {
  /** 헤더와 홈 타이틀에 표시. */
  name: '고급알고리즘',
  /** 이 사이트의 소스 저장소 — 헤더의 GitHub 링크가 여기를 가리킨다. */
  repoUrl: 'https://github.com/lec-algorithm/lecture',
  /** 빌드 시 GitHub API 호출(스타 수 등)에 쓰는 User-Agent. */
  buildUserAgent: 'lec-algorithm-site',
  /** 공개 저장소라 헤더의 GitHub 링크를 노출한다. */
  repoNav: true,
  /**
   * 이 사이트가 제공하는 로케일. 강의 자료가 한국어뿐이라 ko 단일 로케일 —
   * astro.config의 `i18n.defaultLocale`과 첫 항목이 일치해야 한다.
   */
  locales: [{ code: 'ko', label: '한국어', dateLocale: 'ko-KR' }] as {
    code: string;
    label: string;
    dateLocale?: string;
  }[],
  /**
   * 섹션 구성: 강의(courses)·슬라이드(slides)·글(articles)·용어집(glossary)·
   * 소개(pages)를 쓴다.
   * - courses는 opt-in이라 명시적으로 켠다 (src/data/course-categories.ts 필요).
   * - concepts는 개념 문서를 따로 만들지 않는다. 개념 설명은 주제별 강의
   *   문서 안에 두고, 짧은 정의는 용어집이 맡는다.
   * - samples(실행 샘플)는 쓰지 않는다. 실행 가능한 코드는 algorithm-code
   *   저장소가 담당한다.
   * - articles/slides/glossary/pages는 기본 on이라 그대로 둔다.
   * - products/papers는 기본 off(opt-in)라 그대로 둔다.
   * - 도구 카탈로그(stacks)는 테마 코어라 항상 켜져 있고, "실습 환경"으로 쓴다.
   */
  sections: {
    courses: true,
    concepts: false,
    samples: false,
  } satisfies Partial<Record<SectionKey, boolean>>,
  /**
   * 데이터 주도 cards 홈 — 기본 홈(도구 카탈로그) 대신 강의 사이트에 맞는
   * 히어로 + 바로가기 카드 + CTA 구성을 쓴다. 내부 href는 로케일 프리픽스
   * 없이 쓰면 렌더 시 현재 로케일이 붙는다.
   */
  home: {
    template: 'cards' as const,
    hero: {
      title: '고급알고리즘',
      subtitle:
        '2026학년도 2학기 · 연세대학교 첨단융합공학부<br>정렬과 분할 정복에서 그래프와 동적 계획법까지<br>의사코드 한 벌, C와 Python 두 구현',
    },
    cardsTitle: '바로가기',
    cards: [
      {
        href: '/course/',
        name: '강의',
        description: '주제별 강의 문서<br>기초와 분석부터 그래프, 동적 계획법까지',
        tags: ['주제 14개', '중간·기말 범위 표시'],
      },
      {
        href: '/slides/',
        name: '슬라이드',
        description: '수업에서 쓰는 발표 자료<br>브라우저에서 바로 넘겨 봅니다.',
        tags: ['프레젠테이션'],
      },
      {
        href: '/article/',
        name: '공지와 안내',
        description: '휴강·보강 공지, 과제와 개인프로젝트 안내, 제출 규격',
        tags: ['공지', '과제', '안내'],
      },
      {
        href: '/categories/env/',
        name: '실습 환경',
        description: '수업과 과제에서 실제로 쓰는<br>언어, 컴파일러, 작업 도구',
        tags: ['C', 'Python', 'Git'],
      },
    ],
    cta: {
      title: '실습 코드는 별도 저장소에 있습니다',
      description: '주제마다 의사코드와 C, Python 구현이 함께 들어 있습니다.<br>클론해서 직접 돌려 보세요.',
      button: { label: 'algorithm-code 저장소', href: 'https://github.com/lec-algorithm/algorithm-code' },
    },
    /**
     * cards 홈에서는 테마의 카탈로그 Browse 내비가 숨겨지므로, 헤더에
     * "실습 환경" 항목을 추가해 도구 카탈로그 페이지로 연결한다.
     * 홈의 "실습 환경" 카드와 같은 곳(/categories/env/)을 가리킨다.
     */
    browse: { href: '/categories/env/', label: { ko: '실습 환경' } },
  },
  /** 테마 UI 문자열의 로케일별 오버라이드. */
  ui: {
    ko: {
      'site.tagline':
        '고급알고리즘 (SIT2001): 2026학년도 2학기 강의 자료, 슬라이드, 용어집',
    },
  } as Record<string, Record<string, string>>,
};

export type SiteConfig = typeof site;
