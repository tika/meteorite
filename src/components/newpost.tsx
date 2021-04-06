import React from "react";
import { fetcher } from "@app/fetcher";
import { createPostSchema } from "@schemas/posts";
import { Form } from "./form";
import { FormInput } from "./forminput";

interface NewPostProps {
  setIsPosting(val: boolean): void;
}

export function NewPost({ setIsPosting }: NewPostProps) {
  return (
    <div className="bg-white w-80 h-full shadow-md p-4 rounded-md">
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
