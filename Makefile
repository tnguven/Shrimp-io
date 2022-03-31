set-env:
	cp env.example .env

install-deps:
	yarn install

build-run: set-env install-deps
	docker-compose up --build -d && \
	yarn lint && \
	yarn test && \
	yarn e2e

cleanup:
	docker system prune && \
	docker volume rm primary-bid_shrimp-url-data

