import { ZodSchema } from 'zod';
import { Infer } from 'zod/lib/src/types/base';
import { Method } from './endpoint';

export async function fetcher<
  T,
  Schema extends ZodSchema<any, any> = ZodSchema<any, any>
>(method: Method, endpoint: string, body?: Infer<Schema>): Promise<T> {
  const url = `/api${endpoint}`;
  const request = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: body && { 'Content-Type': 'application/json' },
  });

  const json = await request.json();

  if (request.status >= 400) {
    throw new Error(json.message);
  }

  return json;
}
