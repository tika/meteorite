import * as z from "zod";

const username = z.string().min(3);
const password = z.string().min(6);

export const registerSchema = z.object({
  username,
  email: z.string().email(),
  password,
});

export const loginSchema = z.object({
  username: username.optional(),
  password,
});

export const updateSchema = z.object({
  username: username.optional(),
  email: z.string().optional(),
  newPassword: password.optional(),
  password,
});

export const deleteSchema = z.object({
  password,
});
