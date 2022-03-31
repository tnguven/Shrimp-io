import { Request, Response, Params, Query, RequestObj } from 'types';

export function makeExpressCallback<
  B extends object = never,
  C extends object = never,
  Q extends Query = Query,
  P extends Params = Params
>(
  controller: (h: RequestObj<B, C, Q, P>) => Promise<{
    headers: Record<string, unknown>;
    statusCode: number;
    body?: Record<string, unknown>;
    redirect?: string;
  }>
) {
  return async function expressCallback(
    { body, query, params, method, headers, cookies }: Request<Q, P, B>,
    res: Response
  ) {
    try {
      const httpResponse = await controller({
        body,
        query,
        params,
        method,
        cookies,
        headers: {
          'Content-Type': headers['content-type'],
          'User-Agent': headers['user-agent'],
        },
      });

      res.status(httpResponse.statusCode);
      res.set(httpResponse.headers);

      if (httpResponse?.redirect) return res.redirect(httpResponse.redirect);

      res.type('json');
      res.send(httpResponse.body);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An unknown error occurred.' });
    }
  };
}
