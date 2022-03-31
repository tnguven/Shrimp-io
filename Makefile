
set-env:
	cp env.example .env

install:
	yarn install

test:
	yarn lint && \
	yarn test && \
	yarn e2e

build-run:
	docker-compose up --build -d

run-apps:
	docker-compose up -d

cleanup:
	docker system prune && \
	docker volume rm primary-bid_shrimp-url-data

build-run-test: set-env install build-run test
