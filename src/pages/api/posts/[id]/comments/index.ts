import { createEndpoint } from "@app/endpoint";
import { DisplayedError, NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { createCommentSchema } from "@schemas/posts";

// GET => [ comment, comment1 ]
// [Auth] PUT, { content: string } => comment
// [Auth] DELETE => { success: true }

export default createEndpoint({
  GET: async (req, res) => {
    const id = req.query.id as string;

    const post = await prisma.post.findFirst({
      where: { id },
      include: { comments: true },
    });

    if (!post) {
      throw new NotFound("post");
    }

    const comments = post.comments;

    res.json({ comments: comments });
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
        comments: {
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
    const { content } = createCommentSchema.parse(req.body);

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFound("post");
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: user.id,
        postId: postId,
        content: content,
      },
    });

    res.json({ comment: comment });
  },
});
