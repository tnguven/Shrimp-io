import * as core from 'express-serve-static-core';

export type Query = core.Query;

export type Params = core.ParamsDictionary;

export type Response = core.Response;

export type Request<
  ReqQuery = Query,
  URLParams extends Params = core.ParamsDictionary,
  ReqBody = unknown
> = core.Request<URLParams, unknown, ReqBody, ReqQuery>;

export type RequestObj<
  B extends object = never,
  C extends object = never,
  Q extends Query = Query,
  P extends Params = Params
> = {
  headers: {
    'User-Agent': string | undefined;
    'Content-Type': string | undefined;
  };
  method: string;
  body: B;
  cookies: C;
  query: Q;
  params: P;
};

export type EmptyObj = Record<string, never>;
