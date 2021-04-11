import React from "react";
import { fetcher } from "@app/fetcher";
import { createPostSchema } from "@schemas/posts";
import { Form } from "./form";
import { FormInput } from "./forminput";

interface NewPostProps {
  setIsPosting(val: boolean): void;
  className?: string;
  style?: any;
}

export function NewPost({ setIsPosting, className, style }: NewPostProps) {
  return (
    <div
      style={style}
      className={"bg-white w-80 shadow-md p-4 rounded-md z-50 " + className}
    >
      <h2 className="font-medium text-2xl">Create new post</h2>
      <Form
        submit={(body) =>
          fetcher("PUT", "/posts", {
            caption: body.caption,
          }).then(() => setIsPosting(false))
        }
        components={{
          caption: (p) => (
            <FormInput
              multiline={true}
              type="text"
              label="Caption"
              p={p}
              error={p.error}
            />
          ),
        }}
        schema={createPostSchema}
        buttonText="Post"
      />
    </div>
  );
}
