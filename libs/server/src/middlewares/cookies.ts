import { serialize } from 'cookie';
import { v4 } from 'uuid';
import { Request, Response } from 'types';

const ninetyDay = 60 * 60 * 24 * 90;

const avaliableMethods = ['GET', 'POST', 'PUT'];

export function Cookies(req: Request, res: Response, next: () => void) {
  const isValidMethod = avaliableMethods.includes(req.method);
  if (isValidMethod && !req.cookies.token) {
    const token = v4();
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: ninetyDay,
        sameSite: 'strict',
        path: '/',
      })
    );
    req.cookies.token = token;
  }
  next();
}
