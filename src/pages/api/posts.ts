import { createEndpoint } from "../../app/endpoint";
import {
  deleteSchema,
  loginSchema,
  registerSchema,
  updateSchema,
} from "../../schemas/users";
import {
  DisplayedError,
  MissingData,
  NotFound,
  Unauthenticated,
} from "../../app/exceptions";
import bcrypt from "bcrypt";
import { JWT } from "../../app/jwt";
import { prisma } from "../../app/prisma";
import { createPostSchema } from "../../schemas/posts";

export default createEndpoint({
  PUT: async (req, res) => {
    const user = JWT.parseRequest(req);
    const { caption } = createPostSchema.parse(req.body);

    if (!user) throw new NotFound("user");

    const newPost = await prisma.post.create({
      data: {
        caption,
        author: {
          connect: { id: user.id },
        },
      },
    });

    res.json({ post: newPost });
  },
});
