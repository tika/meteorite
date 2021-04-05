import React, { useState } from "react";
import { fetcher } from "../app/fetcher";
import { createPostSchema } from "../schemas/posts";
import { Form } from "./form";
import { FormInput } from "./forminput";

interface NewPostProps {
  setIsPosting(val: boolean): void;
}

export function NewPost({ setIsPosting }: NewPostProps) {
  const [caption, setCaption] = useState("");

  return (
    <div className="bg-white w-full h-full shadow-md p-4 rounded-md">
      <h2 className="font-medium text-2xl">Create new post</h2>
      <Form
        submit={(body) =>
          fetcher("PUT", "/posts", body).then(() => setIsPosting(false))
        }
        components={{
          caption: (p) => (
            <FormInput type="text" label="Caption" p={p} error={p.error} />
          ),
        }}
        schema={createPostSchema}
        buttonText="Post"
      />
    </div>
  );
}
