import { User } from '@prisma/client';

export function santiseUser(user: User) {
  const { email, password, ...rest } = user;
  return rest;  
}