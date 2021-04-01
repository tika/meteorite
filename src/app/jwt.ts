import { User } from '@prisma/client';
import { serialize, parse } from 'cookie';
import * as jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { isDev } from './constants';
import { IncomingMessage } from 'http';

export type JWTPayload = Pick<User, 'id' | 'email'>;

export class JWT {
  public static readonly SECRET_KEY = 'meteorite';
  public readonly user;

  constructor(user: Omit<User, 'password'>) {
    this.user = user;
  }

  public sign(): string {
    const payload: JWTPayload = { id: this.user.id, email: this.user.email };

    return jwt.sign(payload, JWT.SECRET_KEY, {
      expiresIn: '24h',
    });
  }

  public static logoutCookie() {
    return JWT.cookie('', new Date());
  }

  public static cookie(token: string, expiry?: Date): string {
    return serialize('token', token, {
      httpOnly: true,
      expires: expiry || dayjs().add(24, 'hours').toDate(),
      secure: !isDev,
      path: '/',
    });
  }

  public static parseRequest(
    request: IncomingMessage & { cookies: { [key: string]: string } }
  ) {
    if (!request.headers.cookie) {
      return null;
    }

    const { token = null } = parse(request.headers.cookie);

    if (!token) {
      return null;
    }

    return JWT.verify(token);
  }

  public static verify(token?: string): JWTPayload | null {
    if (!token) return null;

    try {
      const { iat, exp, ...payload } = jwt.verify(
        token,
        JWT.SECRET_KEY
      ) as JWTPayload & {
        iat: string;
        exp: number;
      };

      return payload;
    } catch (_) {
      return null;
    }
  }
}
