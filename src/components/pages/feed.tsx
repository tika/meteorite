import { extendedPost, PostElement, SafeUser } from "@components/post";
import React from "react";

interface Props {
  posts: extendedPost[];
  setCommentingOnPost(p: extendedPost): void;
  user: SafeUser;
}

export function Feed(props: Props) {
  return (
    <div className="flex flex-col py-8 gap-10">
      {props.posts.map((post) => (
        <PostElement
          setCommentingOnPost={(p: extendedPost) =>
            props.setCommentingOnPost(p)
          }
          currentUser={props.user}
          post={post}
          key={post.id}
        />
      ))}
    </div>
  );
}
