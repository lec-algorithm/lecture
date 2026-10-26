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
	@awk 'BEGIN { FS = ":.*## " } /^[a-zA-Z0-9_-]+:.*## / { printf "  %-9s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

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

# node_modules 익명 볼륨은 컨테이너를 다시 만들어도 남아 새 이미지의 것을
# 가린다. 기동 때 pnpm install이 맞춰 주지만, 완전히 새로 하려면 clean 먼저.
rebuild: ## 의존성을 바꾼 뒤 이미지를 다시 만들며 편집용으로 가동 (완전히 새로: make clean 먼저)
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

down: ## 중지·정리 (node_modules 볼륨은 남김, 지우려면 down 대신 clean)
	$(COMPOSE) down

# down으로 컨테이너를 먼저 지우면 익명 볼륨은 주인 없이 남아 down -v로도 안
# 지워진다. 그래서 clean은 down 대신 쓴다. 이미 남은 볼륨은 docker volume prune
clean: ## 중지·정리 + node_modules 익명 볼륨까지 삭제 (down 대신)
	$(COMPOSE) down -v

# 검증: Node 없이 사이트 빌드·타입 검사를 돌린다. 바인드 마운트라 지금 고친
# 소스를 본다. 떠 있는 app과 같은 site/(.astro·dist)를 쓰게 되므로 그때는 멈추고,
# run이 만든 네트워크는 끝나고 down으로 치운다 (app이 없을 때만 오므로 안전).
check: ## 컨테이너 안에서 pnpm build && pnpm check (app이 떠 있으면 거부)
	@if [ -n "$$($(COMPOSE) ps -q $(SERVICE))" ]; then \
		echo "app 컨테이너가 떠 있습니다. make down(또는 clean) 뒤에 다시 실행하세요."; exit 1; \
	fi
	$(COMPOSE_DEV) run --rm --no-deps $(SERVICE) sh -c "pnpm install && pnpm build && pnpm check"; \
		status=$$?; $(COMPOSE) down; exit $$status
