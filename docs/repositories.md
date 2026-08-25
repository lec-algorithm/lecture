# 저장소 구성

이 과정은 GitHub 조직 [lec-algorithm](https://github.com/lec-algorithm) 아래
저장소 세 개로 나뉜다. 무엇을 어디에 두는지가 이 문서의 전부다.

## 세 저장소

| 저장소 | 담는 것 | 수강생이 하는 일 |
| --- | --- | --- |
| `lecture` | 강의 자료: 주제별 교안, 슬라이드, 공지·안내 글, 용어집. 빌드하면 공개 사이트가 된다 | 사이트를 본다 (클론할 필요 없음) |
| `algorithm-code` | 실습 코드: 의사코드 + C + Python. 주제별 폴더. compose로 뜨는 컨테이너 하나가 딸린다 | 클론해서 컨테이너를 띄우고 직접 돌리고 고친다 |
| `algorithm-viz` | 시각화 애니메이션: 알고리즘 동작을 움직이는 그림으로 만드는 코드와 산출물 | 슬라이드 안에서 본다. 필요하면 직접 돌려 본다 |

경계가 흐려지기 쉬운 지점을 못 박아 둔다.

- **강의 자료에는 실행되는 코드를 두지 않는다.** 교안·슬라이드의 코드 블록은
  `algorithm-code`에 있는 파일을 보여 주는 발췌이고, 원본은 그쪽이다.
- **실습 코드에는 설명을 길게 쓰지 않는다.** README와 주석은 "어떻게 돌리는가"
  까지만 담고, "왜 이렇게 되는가"는 강의 자료가 맡는다.
- **애니메이션 생성 코드는 실습 코드에 섞지 않는다.** 수강생이 클론하는
  저장소는 알고리즘 자체에만 집중하게 둔다.

## lecture (이 저장소)

- 공개 사이트: `https://lec-algorithm.github.io/lecture/`
- `main` push → GitHub Pages 배포. 상세는 [deployment.md](deployment.md) 참고
- 구조와 실행 방법은 루트 [README.md](../README.md) 참고

## algorithm-code

수강생이 실제로 클론해서 실습하는 저장소. 주제 번호가 폴더 이름이 되고,
한 주제 안에서 예제가 번호 순으로 늘어선다. 예제 하나에 **의사코드 · C ·
Python**이 함께 들어간다.

```plaintext
algorithm-code/
├── compose.yml                          # 실습 컨테이너 (서비스 이름: lab)
├── Dockerfile                           # gcc · gdb · python3
├── topic-01-intro-search/
│   ├── 01_sequential_search/
│   │   ├── sequentialSearch.pseudo
│   │   ├── sequentialSearch.c
│   │   ├── sequential_search.py
│   │   └── README.md
│   └── 02_binary_search/
├── topic-02-basic-sorting/
│   ├── 01_selection_sort/
│   ├── 02_insertion_sort/
│   └── ...
└── README.md
```

- 폴더 이름은 강의 자료의 주제 슬러그와 **글자 그대로 일치시킨다**.
  대응표는 [course-plan.md](course-plan.md)에 있다.
- C와 Python은 같은 알고리즘을 같은 이름의 함수로 구현한다. 언어 차이가
  알고리즘 차이로 보이지 않게 한다.
- 의사코드(`.pseudo`)가 기준이다. 두 구현은 의사코드를 옮긴 것이다.

### 실행 환경

수강생이 설치하는 것은 **Git과 Docker 둘뿐**이다. 컴파일러와 Python은 이미지
안에 넣어 환경 차이를 없앤다.

- 서비스 이름은 `lab` 하나다. 컨테이너를 여러 개로 나누지 않는다.
- 저장소 폴더를 컨테이너의 `/work`에 바인드 마운트한다. 코드는 호스트 편집기로
  고치고 실행만 컨테이너에서 한다.
- 컨테이너는 `sleep infinity`로 떠 있고, 작업은 전부 `docker compose exec`로
  들어가서 한다.

```yaml
# compose.yml
services:
  lab:
    build: .
    working_dir: /work
    volumes:
      - .:/work
    command: sleep infinity
```

```dockerfile
# Dockerfile — 실습에 필요한 것만 담는다
FROM debian:trixie-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential gdb python3 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /work
```

이미지에 소스를 굽지 않는다. 실습 코드는 수강생이 고쳐 가며 쓰는 것이라
마운트가 단일 원본이어야 한다. 이 점이 `lecture` 저장소의 사이트 이미지와
다르다.

2026-08-25에 이 구성을 실제로 띄워 확인했다. `debian:trixie-slim` 기준으로
컨테이너 안의 버전은 아래와 같다. 자료에 찍는 출력은 이 값에 맞춘다.

```console
$ gcc --version
gcc (Debian 14.2.0-19) 14.2.0
$ python3 --version
Python 3.13.5
```

**빌드 산출물은 `.gitignore`에 넣는다.** 컨테이너에서 컴파일한 실행 파일이
마운트를 타고 호스트에 그대로 남는다. macOS나 Windows에서는 돌지 않는
Linux 바이너리이므로, 커밋에 섞이면 저장소만 지저분해진다.

```gitignore
# 컨테이너에서 컴파일한 실행 파일
*.o
*.out
topic-*/**/[a-zA-Z]*[!.]
!topic-*/**/*.*
```

## algorithm-viz

정렬 과정이나 트리 회전처럼 **움직여야 이해되는 것**을 만드는 저장소.
산출물(GIF·MP4·SVG)은 강의 슬라이드에 임베드한다.

- 생성 스크립트와 산출물을 함께 둔다. 슬라이드는 산출물만 참조한다.
- 예전 Keynote 덱이 한 단계당 한 장씩 넘기며 보여 주던 것을 대체하는 자리다.
  웹 슬라이드에서 300장을 넘기게 하지 않기 위한 장치다.

## 수강생 안내

수업에서는 다음 한 줄로 시작한다.

```sh
git clone https://github.com/lec-algorithm/algorithm-code.git
cd algorithm-code
docker compose up -d
docker compose exec lab bash
```

셸에 들어가면 그 다음은 평소 쓰던 명령 그대로다.

```sh
cd topic-01-intro-search/01_sequential_search
gcc -o sequentialSearch sequentialSearch.c && ./sequentialSearch
python3 sequential_search.py
```

개인프로젝트는 수업계획서상 GitHub 저장소가 필수다. 제출 방식은 별도
공지 글로 사이트에 올린다.
