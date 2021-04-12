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
      className={`${props.className} w-96 h-80 bg-gray-100 rounded-t-lg`}
      style={props.style}
    >
      {props.post.comments.map((comment) => (
        <CommentElement comment={comment} />
      ))}
    </div>
  );
}
