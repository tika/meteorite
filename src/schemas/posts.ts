import * as z from "zod";

const caption = z.string().min(3);
const content = z.string().min(3);

export const createPostSchema = z.object({
  caption,
});

export const editPostSchema = z.object({
  caption,
});

export const createCommentSchema = z.object({
  content,
});
