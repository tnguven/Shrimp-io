#!/usr/bin/env bash

if [ -f ../../.env ];
then
  export $(echo $(cat ../../.env | sed 's/#.*//g'| xargs) | envsubst)
  node_modules/.bin/ts-node -r tsconfig-paths/register src/db/create-index.ts
else
  echo '.env does not exist'
fi

