import { extendedPost, PostElement, SafeUser } from "@components/post";
import React, { useEffect } from "react";

interface Props {
  posts: extendedPost[];
  setCommentingOnPost(p: extendedPost): void;
  user: SafeUser;
  text?: string;
}

export function Feed(props: Props) {
  return (
    <div className="flex items-center flex-col py-8 gap-10 col-span-12 sm:col-span-6">
      {props.text && (
        <div className="w-96 -mb-4">
          <h1 className="font-bold text-xl">{props.text}</h1>
        </div>
      )}

      {props.posts.map((post) => (
        <PostElement
          onComment={() => props.setCommentingOnPost(post)}
          currentUser={props.user}
          post={post}
          key={post.id}
        />
      ))}
    </div>
  );
}
