import type { SectionKey } from 'stack-site-builder';

/**
 * 사이트 정체성 — 테마가 `@aas-data/site` alias로 읽어간다.
 * UI 문자열 오버라이드 키는 테마의 src/i18n/ui.ts와 동일하다.
 */
export const site = {
  /**
   * 헤더와 페이지 제목에 표시. 로케일별로 줄 수 있다(테마 1.24.0).
   * 이게 없으면 영어·중국어 페이지의 헤더에도 한국어 과목명이 나온다.
   */
  name: {
    ko: '고급알고리즘',
    en: 'Advanced Algorithms',
    zh: '高级算法',
  },
  /** 이 사이트의 소스 저장소 — 헤더의 GitHub 링크가 여기를 가리킨다. */
  repoUrl: 'https://github.com/lec-algorithm/lecture',
  /** 빌드 시 GitHub API 호출(스타 수 등)에 쓰는 User-Agent. */
  buildUserAgent: 'lec-algorithm-site',
  /** 공개 저장소라 헤더의 GitHub 링크를 노출한다. */
  repoNav: true,
  /**
   * 이 사이트가 제공하는 로케일. 첫 항목이 기본 로케일이며 astro.config의
   * `i18n.defaultLocale`과 일치해야 한다.
   *
   * 중국어 코드가 `zh-CN`이 아니라 `zh`인 이유: 테마가 콘텐츠 id에서 로케일을
   * 잘라낼 때 두 글자를 가정한다(`id.replace(/^[a-z]{2}\//, '')`). 간체가
   * 기본 변종이므로 `zh`로 두고, 표시 이름과 날짜 형식만 zh-CN으로 준다.
   */
  locales: [
    { code: 'ko', label: '한국어', dateLocale: 'ko-KR' },
    { code: 'en', label: 'English', dateLocale: 'en-US' },
    { code: 'zh', label: '简体中文', dateLocale: 'zh-CN' },
  ] as {
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
      title: {
        ko: '고급알고리즘',
        en: 'Advanced Algorithms',
        zh: '高级算法',
      },
      subtitle: {
        ko: '정렬과 분할 정복에서 그래프와 동적 계획법까지<br>의사코드 한 벌, C와 Python 두 구현, 컨테이너 하나',
        en: 'From sorting and divide-and-conquer to graphs and dynamic programming<br>One pseudocode, two implementations in C and Python, one container',
        zh: '从排序、分治到图与动态规划<br>一份伪代码，C 与 Python 两种实现，一个容器',
      },
    },
    cardsTitle: { ko: '바로가기', en: 'Quick links', zh: '快速入口' },
    cards: [
      {
        href: '/course/',
        name: { ko: '강의', en: 'Lectures', zh: '课程' },
        description: {
          ko: '주제별 강의 문서<br>기초와 분석부터 그래프, 동적 계획법까지',
          en: 'Lecture notes by topic<br>From foundations and analysis to graphs and dynamic programming',
          zh: '按主题划分的讲义<br>从基础与分析到图与动态规划',
        },
        tags: ['14', 'C · Python'],
      },
      {
        href: '/slides/',
        name: { ko: '슬라이드', en: 'Slides', zh: '幻灯片' },
        description: {
          ko: '수업에서 쓰는 발표 자료<br>브라우저에서 바로 넘겨 봅니다.',
          en: 'The decks used in class<br>Flip through them right in the browser.',
          zh: '课堂使用的演示文稿<br>在浏览器中直接翻页。',
        },
        tags: ['Slides'],
      },
      {
        href: '/categories/env/',
        name: { ko: '실습 환경', en: 'Lab environment', zh: '实验环境' },
        description: {
          ko: '컨테이너로 고정한 실습 환경<br>Codespaces로 브라우저에서 바로 시작',
          en: 'A lab environment pinned in a container<br>Start in the browser with Codespaces',
          zh: '用容器固定的实验环境<br>通过 Codespaces 在浏览器中直接开始',
        },
        tags: ['Codespaces', 'Docker', 'C · Python'],
      },
    ],
    cta: {
      title: {
        ko: '실습 코드는 별도 저장소에 있습니다',
        en: 'The practice code lives in its own repository',
        zh: '实验代码位于独立仓库',
      },
      description: {
        ko: '주제마다 의사코드와 C, Python 구현이 함께 들어 있습니다.<br>Codespaces로 열면 바로 돌아갑니다.',
        en: 'Every topic ships pseudocode alongside C and Python implementations.<br>Open it in Codespaces and it runs.',
        zh: '每个主题都同时提供伪代码与 C、Python 实现。<br>用 Codespaces 打开即可运行。',
      },
      button: {
        label: { ko: 'algorithm-code 저장소', en: 'algorithm-code repository', zh: 'algorithm-code 仓库' },
        href: 'https://github.com/lec-algorithm/algorithm-code',
      },
    },
    /**
     * cards 홈에서는 테마의 카탈로그 Browse 내비가 숨겨지므로, 헤더에
     * "실습 환경" 항목을 추가해 도구 카탈로그 페이지로 연결한다.
     * 홈의 "실습 환경" 카드와 같은 곳(/categories/env/)을 가리킨다.
     */
    browse: {
      href: '/categories/env/',
      label: { ko: '실습 환경', en: 'Lab environment', zh: '实验环境' },
    },
  },
  /**
   * `pricing` 프론트매터 enum의 라벨. 테마는 en·ko만 갖고 있어서, 채우지 않으면
   * 중국어 페이지의 가격 칩이 한국어로 나온다(테마 1.24.0에서 열린 자리).
   */
  pricingLabels: {
    zh: {
      'completely-free': '完全免费',
      'open-source': '开源',
      'free-tier': '免费额度',
      paid: '付费',
      free: '免费',
    },
  } as Record<string, Record<string, string>>,
  /** 강의 `level`(1\~5)의 라벨. 카드의 별과 툴팁에 쓰인다. */
  difficultyLabels: {
    zh: { '1': '入门', '2': '初级', '3': '中级', '4': '高级', '5': '专家' },
  } as Record<string, Record<string, string>>,
  /** 테마 UI 문자열의 로케일별 오버라이드. */
  ui: {
    ko: {
      'site.tagline':
        '고급알고리즘 (SIT2001): 강의 자료, 슬라이드, 용어집',
    },
    en: {
      'site.tagline':
        'Advanced Algorithms (SIT2001): lecture notes, slides and glossary',
    },
    /**
     * 중국어는 테마가 내장하지 않은 로케일이라(테마는 en·ko만 가짐), 여기서
     * 채우지 않으면 UI 문자열이 기본 로케일인 한국어로 떨어진다. 사이트가
     * 실제로 렌더하는 키를 채운다. 새 섹션을 켜면 그 섹션의 키도 여기 추가한다.
     */
    zh: {
      'site.tagline': '高级算法 (SIT2001)：讲义、幻灯片与术语表',

      // 내비게이션
      'nav.browse': '浏览',
      'nav.blog': '文章',
      'nav.courses': '课程',
      'nav.slides': '幻灯片',
      'nav.concepts': '概念',
      'nav.glossary': '术语表',
      'nav.language': '语言',
      'nav.menu': '菜单',
      'nav.backToTop': '回到顶部',
      'top.label': '回到顶部',

      // 강의
      'course.title': '课程',
      'course.tagline': '循序渐进的课程与讲义，从基础到动手实践。',
      'course.slides': '幻灯片',
      'course.updated': '更新于',

      // 글
      'blog.title': '文章',
      'blog.tagline': '课程公告、作业说明与环境准备指南。',
      'blog.empty': '暂无文章。',
      'article.backToBlog': '全部文章',
      'article.referencedTools': '本文涉及的工具',

      // 슬라이드
      'slides.title': '幻灯片',
      'slides.tagline': '课堂使用的演示文稿，可在浏览器中直接查看。',
      'slides.deck': '演示文稿',
      'slides.open': '打开演示文稿',
      'slides.prev': '上一页',
      'slides.next': '下一页',
      'slides.print': '打印 / PDF',
      'slides.menu': '菜单',
      'slides.overview': '总览',
      'slides.close': '关闭',

      // 용어집
      'glossary.title': '术语表',
      'glossary.tagline': '课程中出现的术语，以及各自指向的页面。',
      'glossary.term': '术语',
      'glossary.tool': '工具',
      'glossary.article': '文章',
      'glossary.course': '课程',
      'glossary.concept': '概念',
      'glossary.noResults': '没有匹配的术语。',
      'glossary.search': '搜索术语…',

      // 개념 (섹션은 꺼져 있지만 용어집이 라벨을 쓴다)
      'concept.title': '概念',
      'concept.updated': '更新于',

      // 목록·정렬·필터
      'sort.label': '排序',
      'sort.recent': '最近更新',
      'sort.stars': 'Star 数',
      'sort.alpha': '按名称',
      'filter.updated': '最后更新',
      'updated.6m': '6 个月以内',
      'updated.1y': '1 年以内',
      'updated.2y': '2 年以内',
      'updated.all': '全部',
      'filter.clear': '清除',
      'results.none': '没有符合条件的工具。',
      'search.placeholder': '搜索工具…',
      'tag.allTools': '全部工具',
      'detail.allTools': '全部工具',
      'detail.relatedWriting': '相关文章',
      'meta.updated': '更新于',
      'project.files': '文件',

      // 테마 전환
      'theme.light': '浅色',
      'theme.dark': '深色',
      'theme.system': '跟随系统',

      // 목차·기타 화면 요소
      'toc.onThisPage': '本页目录',
      'slides.contents': '目录',
      'slides.fullscreen': '全屏',
      'course.backToCourses': '全部课程',
      'tag.heading': '标签',
      'toc.collapseAll': '全部折叠',
      'detail.docs': '文档',
      'detail.website': '官网',
      'detail.license': '许可证',
      'detail.repository': '仓库',
      'detail.relatedTools': '相关工具',
      'project.relatedTools': '相关工具',
      'detail.pricing': '价格',
      'detail.price': '价格',
      'tab.pricing': '价格',
      'course.hours': '学习时长',
      'course.level': '难度',
      'meta.released': '最新版本',
      'theme.label': '主题',
      'private.login': '登录',
      'detail.language': '语言',
      'view.label': '视图',
      'view.standard': '标准',
      'view.gallery': '画廊',

      // private 섹션은 쓰지 않지만 로그인 폼 문자열이 마크업에 남는다
      'private.id': '账号',
      'private.password': '密码',
      'private.submit': '解锁',
      'private.error': '账号或密码不正确。',
      'private.logout': '退出登录',

      // 푸터
      'footer.builtWith': '构建工具：',
      'footer.contribute': '欢迎贡献 — 添加一个 MDX 文件即可收录工具。',
    },
  } as Record<string, Record<string, string>>,
};

export type SiteConfig = typeof site;
