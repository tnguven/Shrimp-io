
copy-tsconfig:
	cp ../../tsconfig.json ./tsconfig.temp.json

remove-temp:
	rm ./tsconfig.temp.json

docker-build:
	docker build . -t express-server -f ./Dockerfile

build: copy-tsconfig docker-build remove-temp
