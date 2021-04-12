import { fetcher } from "@app/fetcher";
import { createCommentSchema } from "@schemas/posts";
import React, { useState } from "react";
import { CommentElement } from "./commentelement";
import { Form } from "./form";
import { FormInput } from "./forminput";
import { extendedPost } from "./post";

interface CommentsProps {
  post: extendedPost;
  className?: string;
  style?: any;
}

export function Comments(props: CommentsProps) {
  const [comments, setComments] = useState(props.post.comments);

  return (
    <div
      className={`${props.className} bg-white w-10/12 sm:w-1/2 xl:w-1/4 h-80 overflow-y-auto shadow-md px-6`}
    >
      <div>
        <div
          className="rounded-t-lg flex flex-col items-baseline gap-4"
          style={props.style}
        >
          {comments.map((comment) => (
            <CommentElement comment={comment} />
          ))}
        </div>
        <div className="bg-white py-2 sticky bottom-0">
          <Form
            submit={(body) =>
              fetcher(
                "PUT",
                `/posts/${props.post.id}/comments`,
                body
              ).then(async () =>
                fetcher(
                  "GET",
                  `/posts/${props.post.id}/comments`
                ).then((body: any) => setComments(body.comments))
              )
            }
            components={{
              content: (p) => (
                <FormInput
                  type="text"
                  placeholder="Comment!"
                  p={p}
                  error={p.error}
                  inline
                />
              ),
            }}
            schema={createCommentSchema}
            buttonText="Comment"
            inline
          />
        </div>
      </div>
    </div>
  );
}
