# 강의 사이트

2026-2 고급알고리즘 강의 사이트. [stack-site-builder](https://github.com/CodeComposeStudio/stack-site-builder)
테마 기반 Astro 사이트로, 이 디렉터리는 **콘텐츠와 사이트 데이터만** 담는다.
라우트·컴포넌트·스타일·마크다운 파이프라인은 전부 테마가 제공한다.

## 개발 명령

Node 24 이상이 필요하다. Docker로 띄우는 방법은 저장소 루트
[README.md](../README.md) 참고

```sh
pnpm install
pnpm dev       # http://localhost:4321/lecture/
pnpm build     # dist/ 정적 빌드 (배포와 같은 산출물)
pnpm check     # astro check (타입 검사)
```

주소에 `/lecture/`가 붙는 이유는 GitHub Pages 프로젝트 사이트의 base 경로를
로컬에서도 그대로 쓰기 때문이다. `http://localhost:4321/`은 404가 난다.

## 콘텐츠를 어디에 쓰는가

| 무엇 | 어디에 | 나오는 주소 |
| --- | --- | --- |
| 주제별 강의 문서 | `src/content/courses/ko/<슬러그>.mdx` | `/course/<슬러그>/` |
| 슬라이드 덱 | `src/content/slides/ko/<슬러그>/index.mdx` | `/slides/<슬러그>/` |
| 공지·안내 글 | `src/content/articles/ko/<슬러그>.mdx` | `/article/<슬러그>/` |
| 단독 페이지 (소개 등) | `src/content/pages/ko/<슬러그>.mdx` | `/<슬러그>/` |
| 실습 환경 카탈로그 | `src/content/stacks/ko/<슬러그>.mdx` | `/stack/<슬러그>/` |

슬러그와 프론트매터 규약은 [../docs/course-plan.md](../docs/course-plan.md),
문장·마크다운 규칙은 [../docs/writing-rules.md](../docs/writing-rules.md) 참고

## 사이트 데이터

| 파일 | 하는 일 |
| --- | --- |
| `src/data/site.ts` | 사이트 이름, 저장소 링크, 섹션 토글, 홈 카드 구성, UI 문자열 |
| `src/data/categories.ts` | 실습 환경 카탈로그(`stacks`)의 분류 트리 |
| `src/data/course-categories.ts` | 강의 문서의 분류 트리 |
| `src/data/article-categories.ts` | 글의 분류 트리 |
| `src/data/concept-categories.ts` | concepts는 꺼져 있지만 테마가 import하므로 남겨 둔다 |
| `src/data/glossary.mjs` | `[[용어]]` 위키링크의 대상. 미등록 용어는 빌드가 실패한다 |
| `src/content.config.ts` | 테마의 컬렉션 정의에 카테고리 맵을 넘긴다 |
| `astro.config.mjs` | site·base, 로케일, 내부 링크에 base를 붙이는 remark 플러그인 |

## 슬라이드 작성

슬라이드 덱은 MDX 안에서 `<Slide>` 컴포넌트로 쓴다.

```mdx
import Slide from 'stack-site-builder/components/Slide.astro';

<Slide class="cover">   {/* 표지: 가운데 정렬, 큰 제목 */}
<Slide>                 {/* 일반 슬라이드: 제목이 위에 고정 */}
<Slide class="center">  {/* 짧은 내용: 세로 가운데 정렬 */}
<Slide toc={false}>     {/* 이 슬라이드를 목차에서 제외 */}
<Slide source="출처">   {/* 오른쪽 아래 작은 출처 표기 */}
```

- 제목 아래 부제는 `::sub[부제 내용]` 디렉티브로 쓴다.
- 프론트매터에서 `transition`(slide/none), `theme`, `aspect`, `toc_level`을 고른다.
- 코드 블록과 mermaid 다이어그램을 그대로 쓸 수 있다.
- 작성 후에는 브라우저에서 넘겨보며 줄바꿈을 확인한다 (writing-rules의 슬라이드 규칙)

## 알려진 빌드 로그

빌드 중에 아래 메시지가 나오지만 오류가 아니다. 테마가 꺼진 섹션의 컬렉션도
조회하기 때문이고, 산출물에는 영향이 없다.

- `The base directory "…/src/content/{concepts,papers,products}/" does not exist.`
- `The collection "products" does not exist or is empty.`
