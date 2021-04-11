import { createEndpoint } from "@app/endpoint";
import { DisplayedError, NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";

export default createEndpoint({
  GET: async (req, res) => {
    const id = req.query.id as string;

    const post = await prisma.post.findFirst({
      where: { id },
      include: { likedBy: true },
    });

    if (!post) {
      throw new NotFound("post");
    }

    const safeUsers = post.likedBy.map((user) => {
      const { email, password, ...rest } = user;
      return rest;
    });

    res.json({ likedBy: safeUsers });
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
        likedBy: {
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

    if (post.authorId !== user.id) {
      throw new DisplayedError(400, "You cannot update a post you do not own");
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.json({ success: true });
  },
});
