import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { santiseMany } from "@app/santise";

export default createEndpoint({
  GET: async (req, res) => {
    const commentId = req.query.commentId as string;

    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
      include: { likedBy: true },
    });

    if (!comment) {
      throw new NotFound("comment");
    }

    res.json({ likedBy: santiseMany(comment.likedBy) });
  },
  DELETE: async (req, res) => {
    const user = JWT.parseRequest(req);
    const commentId = req.query.commentId as string;

    if (!user) {
      throw new NotFound("user");
    }

    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFound("comment");
    }

    await prisma.comment.update({
      where: { id: commentId },
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

    const commentId = req.query.commentId as string;

    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFound("comment");
    }

    await prisma.comment.update({
      where: { id: commentId },
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
