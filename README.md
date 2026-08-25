# 고급알고리즘

2026학년도 2학기 **고급알고리즘**(SIT2001-01, 연세대학교 첨단융합공학부)의
강의 자료 저장소입니다. 강의 문서·슬라이드·용어집을 담은 사이트를 빌드해
GitHub Pages로 공개합니다.

- 공개 사이트: [lec-algorithm.github.io/lecture](https://lec-algorithm.github.io/lecture/)
- 실습 코드: [lec-algorithm/algorithm-code](https://github.com/lec-algorithm/algorithm-code)
- 시각화 자료: [lec-algorithm/algorithm-viz](https://github.com/lec-algorithm/algorithm-viz)
- 수업계획서: [docs/syllabus.md](docs/syllabus.md)

## 개요

- 대상: 첨단융합공학부 학부생. 선수 추천과목은 Computer Programming
- 방식: 강의 50% · 실습 50%. 의사코드로 알고리즘을 정의하고 C와 Python으로 구현합니다
- 평가: 절대평가. 중간 20% · 기말 40% · 과제 10% · 개인프로젝트 25% · 출석 5%
- 개인프로젝트는 GitHub 저장소 제출이 필수입니다

```mermaid
flowchart LR
    F("기초와 분석<br/>탐색 · 재귀 · 점근 표기법") --> S("정렬<br/>기본 정렬 · 분할 정복 · 퀵 · 기수")
    S --> D("자료구조<br/>BST · 해시 · 트라이")
    D --> G("그래프<br/>탐색 · MST · 최단 경로")
    G --> P("설계 전략과 응용<br/>그리디 · 동적 계획법 · 정규식")
```

## 자료와 코드의 분리

**이 저장소는 강의 자료만 담습니다.** 실행되는 코드는 다른 두 저장소에 있고,
경계는 [docs/repositories.md](docs/repositories.md)에 정리되어 있습니다.

| 저장소 | 담는 것 | 수강생이 하는 일 |
| --- | --- | --- |
| `lecture` | 강의 문서, 슬라이드, 공지, 용어집 | 사이트를 봅니다 |
| `algorithm-code` | 주제별 의사코드 · C · Python 구현 | 클론해서 직접 돌립니다 |
| `algorithm-viz` | 알고리즘 동작 시각화 | 슬라이드 안에서 봅니다 |

실습은 다음 한 줄로 시작합니다.

```sh
git clone https://github.com/lec-algorithm/algorithm-code.git
cd algorithm-code
```

## 저장소 구조

```plaintext
lecture/
├── site/                    # 강의 사이트 (stack-site-builder 기반 Astro)
├── docs/                    # 수업계획서, 변환 계획, 규칙 문서
├── scripts/                 # 저장소 스크립트 (문서 스타일 검사)
├── .github/workflows/       # GitHub Pages 배포
├── docker-compose.yml       # 사이트 실행 (보기 전용, 소스 내장)
├── docker-compose.dev.yml   # 사이트 실행 (site/ 바인드 마운트 + 핫리로드)
├── AGENTS.md                # AI 도구용 저장소 가이드
├── CHANGELOG.md             # 변경 기록
└── README.md
```

## 강의 사이트 실행

Docker만 있으면 저장소 루트에서 바로 띄울 수 있습니다. Node나 pnpm을 깔 필요는
없습니다.

### 보기 전용

소스와 의존성이 이미지에 들어 있어 클론 직후 바로 뜹니다.

```sh
docker compose up      # 사이트 가동: http://localhost:4321/lecture/
docker compose down    # 중지·정리
```

### 콘텐츠 편집 (개발용)

`site/`를 바인드 마운트해 호스트에서 고친 내용이 핫리로드로 반영됩니다.
자료를 쓰거나 고칠 때는 이쪽을 씁니다.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# 백그라운드로 띄우고 로그만 따라가기
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose logs -f app

# 중지·정리 (node_modules 볼륨까지 지우려면 -v)
docker compose down
```

`docker-compose.dev.yml`은 별도 스택이 아니라 **오버라이드**입니다. 같은 `app`
서비스를 덮어써 두 파일이 한 컨테이너로 합쳐집니다.

의존성을 바꾼 뒤에는 이미지를 다시 만들어야 합니다.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 로컬 pnpm

컨테이너 없이 직접 돌리려면 Node 24 이상이 필요합니다.

```sh
cd site
pnpm install
pnpm dev       # http://localhost:4321/lecture/
pnpm build     # dist/ 정적 빌드 (배포와 같은 산출물)
pnpm check     # astro check (타입 검사)
```

콘텐츠를 어디에 쓰는지 등 자세한 내용은
[site/README.md](site/README.md)를 참고하세요.

### base 경로 주의

주소에 `/lecture/`가 붙는 이유는 GitHub Pages 프로젝트 사이트의 base 경로를
로컬에서도 그대로 쓰기 때문입니다. `http://localhost:4321/`은 404가 납니다.
배포는 [docs/deployment.md](docs/deployment.md)를 참고하세요.

## 기여

git flow를 따릅니다. 새 작업은 `develop`에서 `feature/*` 브랜치를 만들어
시작하고, `main`에는 직접 커밋하지 않습니다. 상세 규칙은
[docs/git-workflow.md](docs/git-workflow.md), 문서·콘텐츠 작성 규칙은
[docs/writing-rules.md](docs/writing-rules.md)를 참고하세요.

## 라이선스

강의 자료의 라이선스는 추후 명시 예정입니다.
