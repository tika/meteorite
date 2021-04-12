import React from "react";
import { Comment } from ".prisma/client";
import { CommentElement } from "./commentelement";

interface CommentsProps {
  comments: Comment[];
}

export function Comments(props: CommentsProps) {
  return (
    <div>
      {props.comments.map((comment) => (
        <CommentElement comment={comment} />
      ))}
    </div>
  );
}
