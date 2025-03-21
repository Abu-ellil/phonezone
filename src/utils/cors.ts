// utils/cors.ts
import { NextApiRequest, NextApiResponse } from "next";

type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result: unknown) => void
) => void;

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
) {
  return new Promise<unknown>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
