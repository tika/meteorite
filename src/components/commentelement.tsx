import { Comment } from ".prisma/client";
import React from "react";

export function CommentElement({ comment }: { comment: Comment }) {
  return (
    <div>
      <p>{comment.content}</p>
    </div>
  );
}
