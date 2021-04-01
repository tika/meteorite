import { NextApiHandler } from 'next';
import { isDev } from './constants';
import { DisplayedError } from './exceptions';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function createEndpoint<Resource>(
  methods: Partial<Record<Method, NextApiHandler<Resource>>>
): NextApiHandler<Resource | { message: string }> {
  const supportedMethods = Object.keys(methods);

  return async (req, res) => {
    const handler = methods[(req.method || 'GET') as Method];

    if (!handler) {
      return res.status(405).json({
        message: `You must ${supportedMethods.join(', ')} to this endpoint!`,
      });
    }

    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof DisplayedError) {
        return res.status(e.code).json({ message: e.message });
      }

      res
        .status(500)
        .json({ message: isDev ? e.message : 'Something went wrong.' });
    }
  };
}
