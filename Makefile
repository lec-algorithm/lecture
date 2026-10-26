# 강의 사이트를 docker compose로 띄우는 단축 명령. 저장소 루트에서 `make`로
# 목록을 본다. 사이트 주소는 http://localhost:4321/lecture/ 이다.
#
# compose 파일은 둘이다. docker-compose.yml은 소스를 이미지에 내장한 보기 전용,
# docker-compose.dev.yml은 같은 app 서비스를 덮어써 site/를 바인드 마운트하는
# 오버라이드다. 그래서 띄우는 타깃만 두 갈래로 나뉘고, logs·down처럼 이미 뜬
# 컨테이너를 다루는 타깃은 어느 쪽으로 띄웠든 똑같이 동작한다.
#
# macOS 기본 GNU make 3.81에서 돌도록 그보다 새 기능은 쓰지 않는다.

COMPOSE     := docker compose
COMPOSE_DEV := $(COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml
SERVICE     := app
URL         := http://localhost:4321/lecture/

.DEFAULT_GOAL := help
.PHONY: help up up-d dev dev-d build rebuild logs ps restart shell down clean check

help: ## 타깃 목록
	@echo "사용법: make <타깃>   (사이트: $(URL))"
	@awk 'BEGIN { FS = ":.*## " } /^[a-z-]+:.*## / { printf "  %-9s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# 보기 전용: 소스와 의존성이 이미지에 들어 있다.

up: ## 보기 전용으로 가동 (포그라운드, Ctrl-C로 중지)
	$(COMPOSE) up

up-d: ## 보기 전용으로 백그라운드 가동
	$(COMPOSE) up -d
	@echo "사이트: $(URL)"

build: ## 이미지 다시 만들기 (git pull 뒤 보기 전용 모드에 새 소스를 넣을 때)
	$(COMPOSE) build

# 개발: site/를 바인드 마운트해 호스트에서 고친 내용이 핫리로드된다.

dev: ## 콘텐츠 편집용으로 가동 (site/ 바인드 마운트 + 핫리로드)
	$(COMPOSE_DEV) up

dev-d: ## 콘텐츠 편집용으로 백그라운드 가동 (로그는 make logs)
	$(COMPOSE_DEV) up -d
	@echo "사이트: $(URL)"

rebuild: ## 의존성을 바꾼 뒤 이미지를 다시 만들며 편집용으로 가동
	$(COMPOSE_DEV) up --build

# 뜬 컨테이너 다루기: 어느 모드로 띄웠든 같은 app 서비스다.

logs: ## app 로그 따라가기
	$(COMPOSE) logs -f $(SERVICE)

ps: ## 컨테이너 상태
	$(COMPOSE) ps

restart: ## app 재시작 (테마를 올린 뒤 등)
	$(COMPOSE) restart $(SERVICE)

shell: ## app 컨테이너 안 셸
	$(COMPOSE) exec $(SERVICE) sh

down: ## 중지·정리
	$(COMPOSE) down

# down으로 컨테이너를 먼저 지우면 익명 볼륨은 주인 없이 남아 down -v로도 안
# 지워진다. 그래서 clean은 down 대신 쓴다.
clean: ## 중지·정리 + node_modules 익명 볼륨까지 삭제 (down 대신)
	$(COMPOSE) down -v

# 검증: Node 없이 커밋 전 검사를 돌린다. 바인드 마운트라 지금 고친 소스를 본다.

check: ## 컨테이너 안에서 pnpm build && pnpm check (커밋 전 검증)
	$(COMPOSE_DEV) run --rm --no-deps $(SERVICE) sh -c "pnpm install && pnpm build && pnpm check"
