import React from "react";
import { CommentElement } from "./commentelement";
import { extendedPost } from "./post";

interface CommentsProps {
  post: extendedPost;
  className?: string;
  style?: any;
}

export function Comments(props: CommentsProps) {
  return (
    <div
      className={`${props.className} w-64 h-64 bg-red-500`}
      style={props.style}
    >
      {props.post.comments.map((comment) => (
        <CommentElement comment={comment} />
      ))}
    </div>
  );
}
