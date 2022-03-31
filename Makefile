
set-env:
	@[ -f ./.env ] && true || cp env.example .env;

install:
	yarn install

test:
	yarn lint && \
	yarn test && \
	yarn e2e:headless

build-run: set-env
	docker-compose up --build -d

run-apps: set-env
	docker-compose up -d

cleanup:
	docker system prune && \
	docker volume rm primary-bid_shrimp-url-data

build-run-test: set-env install build-run test
