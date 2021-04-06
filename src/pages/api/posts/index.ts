import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { createPostSchema } from "@schemas/posts";

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
