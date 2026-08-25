# Changelog

이 저장소(강의 자료)의 변경 기록. 형식은
[Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따른다.

## [1.0.0] - 2026-08-25

기본 셋업 완료. 사이트가 공개된다.

### Added

- 저장소 기본 셋업 (`feature/base_setup`)
    - 운영 규칙 문서: git 워크플로, 콘텐츠 작성 규칙, 문서 작성 규칙, 배포
    - 문서 스타일 검사기 `scripts/check-style.py`
    - 2026-2 수업계획서 전사 (`docs/syllabus.md`)
    - 예전 Keynote 덱 13종(2,367쪽) 분석과 주제 대응표 (`docs/source-materials.md`)
    - 주제 14개 + 보너스 1개로의 재편 계획, 주차별 진도, 프론트매터 규약
      (`docs/course-plan.md`)
    - 저장소 세 개(`lecture`, `algorithm-code`, `algorithm-viz`)의 역할 분담
      (`docs/repositories.md`)
    - stack-site-builder 기반 강의 사이트 (`site/`): cards 홈, 소개 페이지,
      사이트 안내와 실습 환경 준비 글, 실습 환경 카탈로그 3종, 오리엔테이션
      슬라이드 덱, 주제 15개의 로드맵 스텁, 용어 25개
    - Docker 실행 구성 (보기 전용 / 바인드 마운트 개발용)
    - 실습 환경을 컨테이너 기준으로 정리: 수강생 준비물은 Git · Docker ·
      GitHub 계정 셋이고, 실행 명령은 `docker compose exec` 기준으로 쓴다.
      `algorithm-code`의 compose·Dockerfile 설계는 `docs/repositories.md` 참고
    - GitHub Pages 배포 워크플로
- `algorithm-code` 저장소 기본 셋업과의 정합 (2026-08-25)
    - 실습 컨테이너를 실제로 만들어 돌려 보고, 자료의 명령·출력을 그 결과에
      맞췄다. 실행 파일 이름 규약은 `*.out`이다.
    - Codespaces를 주 실습 경로로 삼고 자료를 재구성했다. 명령은 컨테이너 안을
      기준으로 쓰고, 로컬 Docker는 같은 자리에 서는 두 번째 경로로 둔다.
    - `algorithm-code`를 template 저장소로 다루도록 시작 흐름을 바꾸고,
      GitHub 화면 캡처 두 장을 슬라이드와 안내 글에 넣었다.
- 다국어: 한국어·영어·중국어 간체 세 로케일 (2026-08-25)
    - 강의 문서 15편, 슬라이드 덱, 안내 글, 소개 페이지, 실습 환경 카탈로그,
      용어 25개, 분류 트리를 세 언어로 제공한다.
    - 중국어 UI 문자열은 `site.ts`의 `ui.zh`가 공급한다. 테마가 en·ko만
      내장하기 때문이다.
- 저장소를 넷으로 나눴다 (2026-08-25)
    - `algorithm-env`(실습 환경 template, 버전 관리)와 `algorithm-code`(강의
      예제, 학기 중 자람)를 분리했다. `Use this template`은 git 히스토리를
      끊으므로, 예제 저장소를 복사하면 새 주제를 받을 수 없다. 복사할 것과
      복사하지 않을 것을 나눈 이유다.
    - 슬라이드와 안내 글에 두 흐름을 GitHub 화면 캡처 네 장으로 나눠 실었다.
      세 언어 모두 반영했다.

[1.0.0]: https://github.com/lec-algorithm/lecture/releases/tag/v1.0.0
