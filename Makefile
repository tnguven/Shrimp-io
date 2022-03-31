
set-env:
	@[ -f ./.env ] && true || cp env.example .env;

install:
	yarn install

test: install
	yarn lint && \
	yarn test && \
	yarn e2e:headless

build-run: set-env
	docker-compose up --build -d

run-apps: set-env
	docker-compose up -d

build-run-test: set-env install build-run test
