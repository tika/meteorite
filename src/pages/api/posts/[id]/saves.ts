import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { santiseMany } from '@app/santise';

export default createEndpoint({
  GET: async (req, res) => {
    const id = req.query.id as string;

    const post = await prisma.post.findFirst({
      where: { id },
      include: { savedBy: true },
    });

    if (!post) {
      throw new NotFound("post");
    }

    res.json({ savedBy: santiseMany(post.savedBy) });
  },
  DELETE: async (req, res) => {
    const user = JWT.parseRequest(req);
    const postId = req.query.id as string;

    if (!user) {
      throw new NotFound("user");
    }

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFound("post");
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        savedBy: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });

    res.json({ success: true });
  },
  PUT: async (req, res) => {
    const user = JWT.parseRequest(req);

    if (!user) {
      throw new Error("Unknown User");
    }

    const postId = req.query.id as string;

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFound("post");
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        savedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.json({ success: true });
  },
});
