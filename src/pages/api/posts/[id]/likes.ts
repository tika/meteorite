import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
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
    
    await prisma.notification.deleteMany({
      where: {
        contentId: post.id,
        authorId: user.id,
        notifiedUserId: post.authorId
      }
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
        likedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        contentId: postId,
        contentType: "post",
        action: "like",
        notifiedUserId: post.authorId,
        authorId: user.id
      }
    });

    res.json({ success: true });
  },
});
