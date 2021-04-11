import React from "react";
import { fetcher } from "@app/fetcher";
import { createPostSchema } from "@schemas/posts";
import { Form } from "./form";
import { FormInput } from "./forminput";
import { Cross } from "./svg/cross";

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
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-medium text-2xl">Create new post</h2>
        <Cross
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsPosting(false)}
        />
      </div>

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
