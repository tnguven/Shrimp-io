# Basic Next.js setup with typescript

I have a simple state management in a single page with Context api and used css modules for 
styling.  

### main commands

``` json 
"scripts": {
  "dev"              : "next",
  "build"            : "NODE_ENV=production next build",
  "start"            : "next start",
  "typecheck"        : "tsc --skipLibCheck",
  "lint"             : "next lint && yarn typecheck",
  "test"             : "jest --runInBand",
  "clean"            : "rimraf dist *.tsbuildinfo",
  "clean-all"        : "yarn clean && rimraf node_modules types",
  "test:ci"          : "jest --ci",
  "cypress"          : "cypress open",
  "cypress:headless" : "cypress run"
}
```
