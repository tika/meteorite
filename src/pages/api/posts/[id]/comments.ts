import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { createCommentSchema } from "@schemas/posts";

// GET (comments on post) => [ comment, comment1 ]
// [Auth] PUT, { content: string, parentId: string } => comment

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
  PUT: async (req, res) => {
    const user = JWT.parseRequest(req);

    if (!user) {
      throw new Error("Unknown User");
    }

    const postId = req.query.id as string;
    const { content, parentId } = createCommentSchema.parse(req.body);

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFound("post");
    }

    if (parentId) {
      const parentComment = await prisma.comment.findFirst({
        where: { id: parentId }
      });

      if (!parentComment) {
        throw new NotFound("parent comment");
      }
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: user.id,
        postId: postId,
        content: content,
        parentCommentId: parentId,
      },
    });

    res.json({ comment: comment });
  },
});
