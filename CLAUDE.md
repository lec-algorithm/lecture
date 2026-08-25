# CLAUDE.md

2026-2 고급알고리즘(SIT2001-01) 강의 자료 저장소. 이 문서는 이 저장소에서
작업하는 AI 도구를 위한 가이드다. **상세 규칙은 `docs/`에 있다**. 여기에는
요약과 링크만 둔다. 문서 목록은 `docs/README.md` 참고

## 이 저장소의 범위

- 여기는 **강의 자료만** 담는다. 실행되는 코드는 조직
  `github.com/lec-algorithm`의 다른 두 저장소에 있다.
  - `algorithm-code`: 주제별 의사코드 + C + Python 구현 (수강생이 클론한다)
  - `algorithm-viz`: 시각화 애니메이션 생성과 산출물
  - 경계는 `docs/repositories.md` 참고
- 강의 내용의 기준은 `docs/syllabus.md`(학교 수업계획서)다. **이 파일은 외부
  원본을 그대로 옮긴 것이라 수정하지 않는다.** 스타일 검사에서도 제외된다.
- 자료 재편 계획(주제 14개, 주차 대응, 프론트매터 규약)은
  `docs/course-plan.md`, 예전 Keynote 덱의 내용 분석은
  `docs/source-materials.md`에 있다.

## 저장소 구조

- `site/`: stack-site-builder 기반 Astro 강의 사이트. 강의·슬라이드·글·실습
  환경 카탈로그·용어집. 콘텐츠 작성 위치와 개발 명령은 `site/README.md` 참고
- `docs/`: 수업계획서, 변환 계획, 규칙 문서(작성·문서화·git·배포)
- `.github/workflows/deploy.yml`: `main` push → GitHub Pages 배포

## Git 워크플로: git flow (상세: `docs/git-workflow.md`)

- 새 작업은 항상 `develop`에서 `feature/*` 브랜치를 만들어 시작한다.
  `main`에는 직접 커밋하지 않는다. PR 대상도 기본적으로 `develop`이다.
- **`main`은 곧 공개 사이트다.** push되면 그대로 배포된다.
- **커밋하면서 진행한다**. 논리 단위가 완결되면 바로 커밋하고, 여러 작업의
  변경을 워킹 트리에 쌓아두지 않는다. 한 커밋에는 한 가지 주제만 담는다.
- 커밋 전 검증: 사이트 변경이 있으면 `cd site && pnpm build && pnpm check`,
  md/mdx 문서 변경이 있으면 `python3 scripts/check-style.py` 통과 필수.
  커밋 메시지 제목은 영어 명령형 한 줄
- **예전 PDF 원본을 커밋하지 않는다.** 저장소 바깥(`../lecture_old_pdfs`)에 둔다.

## 개발 명령

```sh
# repo 루트에서 — Docker (Node/pnpm 설치 불필요)
docker compose up                            # 보기 전용 (소스 내장)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up  # site/ 바인드 마운트 + 핫리로드

# site/ 에서 — 로컬 pnpm
pnpm dev / pnpm build / pnpm check
```

사이트는 base 경로 `/lecture` 아래 산다. 로컬 접속 주소도
`http://localhost:4321/lecture/` 다. 저장소 이름을 바꾸면
`site/astro.config.mjs`의 `base`도 함께 바꿔야 한다. 배포는
`docs/deployment.md` 참고

## 콘텐츠 작성 규칙 (상세: `docs/writing-rules.md`, `docs/documentation-rules.md`)

- 표 안의 파이프는 `\|`로 이스케이프한다 (위키링크 포함: `[[big-o\|Big-O]]`)
- 물결표 범위 표기는 `3\~4주차`처럼 이스케이프한다 (한 문단에 `~` 두 개면 취소선)  
  **단, 프론트매터(YAML)에서는 이스케이프하지 않는다.** YAML은 `"3\~4주차"`를
  잘못된 escape sequence로 보고 빌드를 세운다.
- 한글 문장에서 줄표(`—`)로 구절을 잇지 않는다. 문장을 끊거나 리스트·쉼표·괄호로 바꾼다.
- 볼드가 괄호·따옴표로 끝나고 바로 뒤에 한글이 붙으면(`…(merge sort)**이고`) `**`가
  그대로 노출된다. 문장을 다듬어 띄우거나 `<strong>` 태그를 쓴다.
- `.mdx`에서 `<https://…>` 꺾쇠 자동 링크는 JSX로 해석되어 빌드 실패.
  `[텍스트](URL)` 또는 코드 스팬을 쓴다.
- 닫는 괄호로 끝나는 문장에는 마침표를 겹치지 않는다 (`).` 금지)
- **마침표는 종결 형태로 판단한다.** 서술어(`~합니다`·`~한다`)로 끝나면 찍고,
  명사형(`~정리`·`~참고`)으로 끝나면 안 찍는다. 불릿·카드 설명·슬라이드 본문도
  동일하다. 예외는 제목·표 셀·프론트매터 값 셋뿐이다.
- `[[용어]]` 위키링크는 `site/src/data/glossary.mjs` 등록 용어만 (미등록은 빌드 실패)
- 복잡도는 `O(n log n)`처럼 쓰고, 별표를 곱셈 기호로 쓰지 않는다.
- 저장소명(`algorithm-code`·`algorithm-viz`)과 코드 경로는 원문 그대로 코드 스팬
- 슬라이드는 작성·수정 후 브라우저에서 줄바꿈이 어색하지 않은지 확인한다.
- 상세 규칙은 한 곳(docs)에만 두고 다른 문서에서는 링크한다.

## 프론트매터 규약 (상세: `docs/course-plan.md`)

- 강의(`courses`)의 `order`는 **문자열 내림차순**이다. 주제 번호가 작을수록
  위에 오도록 `order = 9100 - 주제번호`로 쓴다 (주제 01 → `"9099"`)
- 슬라이드(`slides`)의 `order`는 **숫자 오름차순**이다. 주제 번호를 그대로 쓴다.
- 강의의 `category`는 `site/src/data/course-categories.ts`의 id만 쓸 수 있다.
  (미등록 id는 빌드 실패)

## 공개 저장소

이 저장소는 공개다. private(수강생 전용) 콘텐츠 기능은 쓰지 않는다. 암호화된
본문이라도 소스가 공개면 원문이 그대로 보인다. 시험 문제·정답·미공개 과제·
개인정보·성적을 콘텐츠나 커밋에 넣지 않는다.
