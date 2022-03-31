# Shrimp.io

Shrimp.io is an example of a URL shortener service in a Monolith form. I've
used [Next.js](libs/client/README.md)
for the client-side and an [Express server](libs/server/README.md) in the backend with a simple rest
API. The codebase uses yarn workspace and manages it with Lerna.

Backend works via sessionToken. When a user send a request to backend, backend will check the
cookies to prevent the existing user or will generate and send it back to client for the next call.
I have to add a reverse proxy to make cors happy while playing in local env.

### Main folder structure

```shell
scripts\         
libs\            
   |--client\        # Next.js
   |--cors\          # Nginx reverse proxy setup
   |--server\        # Express server
docker-compose.yml   # main orchestrator
Dockerfile.client    # these configuration created here because of scope
Dockerfile.server 
Makefile             # main works
```

### Quick start

For the first run, there is one command to help start everything. This command will set up all the
dependencies to start and run the application and run the tests.

``` makefile
make build-run-test
```

or run the commands manually.

``` shell
cp env.example .env && \
yarn install && \
docker-compose up --build -d && \
yarn lint && \
yarn test && \
yarn e2e
```

After execution complete we can see the application UI at http://localhost:80.

### Basic commands from the root

``` json
"scripts": {
  "build"           : "lerna run build --stream --concurrency 2",
  "dev"             : "kill-port --port 8080,3000 &&yarn lerna run dev --parallel --stream",
  "test"            : "lerna run test --stream",
  "e2e"             : "lerna run --scope @shrimp/client cypress:headless", # depends on docker
  "lint"            : "lerna run lint --stream --concurrency 2",
  "clean"           : "lerna run clean --stream --concurrency 2", # clean generated files and folders
  "clean-all"       : "lerna run clean-all --stream --concurrency 2 && yarn clean-workspace", #  remove all deps
  "clean-workspace" : "rimraf yarn-error.log node_modules",
  "diff"            : "lerna diff"
},
```

yarn dev will start the dev environment to make fast development but connection between client and
server doesn't work well.

``` shell
yarn dev  # will start mongodb, client and server together.
```

yarn test will run all the unit test and some integration test on server side with supertest.

``` shell
yarn e2e
```

yarn e2e will run the cypress test but depends on docker to run the tests against.

``` shell
yarn e2e
```

### .evn

Default I set up env for make the local stuff works. DOMAIN will be responsible for shortUrl prefix.

```dotenv
MONGO_DATABASE=shrimp
MONGO_INITDB_ROOT_PASSWORD=secret
MONGO_INITDB_ROOT_USERNAME=admin

DB_USERNAME=developer
DB_PASSWORD=moreSecret

MONGO_HOSTNAME=mongodb
MONGO_PORT=27017

SERVER_HOST=http://localhost/api
SERVER_PORT=8080

CLIENT_SERVER_PORT=3000

DOMAIN=https://pbid.io # domain name will change the shorturl.
```
