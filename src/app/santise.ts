import { User } from '@prisma/client';

export function santiseUser(user: User) {
  const { email, password, ...rest } = user;
  return rest;  
}

export function santiseMany(users: User[]) {
  return users.map((u) => santiseUser(u));
}

export function santisePosts(posts: any[]) { // Any type - we can mutate post.createdAt
  return posts; // posts.map((p) => (p.createdAt = p.createdAt.toISOString()))
}