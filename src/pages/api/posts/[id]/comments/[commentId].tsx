import { createEndpoint } from "@app/endpoint";
import { DisplayedError, NotFound, Unauthorized } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";

// GET => comment
// [Auth] PUT, { content: string } => comment
// [Auth] DELETE => { success: true }

export default createEndpoint({
  GET: async (req, res) => {
    const commentId = req.query.commentId as string;

    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFound("comment");
    }

    res.json(comment);
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

    if (comment.authorId != user.id) {
      throw new DisplayedError(
        400,
        "You cannot delete a comment you do not own"
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.json({ success: true });
  },
});
