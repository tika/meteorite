import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Cross } from "./svg/cross";
import toast from "react-hot-toast";
import { GridAdd } from "./svg/gridadd";
import { createPostSchema, createCommentSchema } from "../schemas/posts";
import { fetcher } from "@app/fetcher";
import { extendedPost } from "./post";

export type PopupState = "posting" | "commenting" | undefined;

interface PopupProps {
  currentPopup: PopupState;
  currentData: any | undefined;
  closeThis(): void;
}

const profilePicture =
  "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

export function Popup(props: PopupProps) {
  return (
    <div className="w-full fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition ease-in-out duration-150">
      {props.currentPopup == "posting" && (
        <Posting close={() => props.closeThis()} />
      )}
      {props.currentPopup == "commenting" && (
        <Commenting close={() => props.closeThis()} post={props.currentData} />
      )}
      <div className="h-screen w-full z-20 bg-black opacity-70" />
    </div>
  );
}

function Commenting({ close, post }: { close(): void; post: extendedPost }) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function postComment() {
    setIsSubmitting(true);
    if (!createCommentSchema.safeParse({ content }).success) {
      setIsSubmitting(false);
      return toast.error("Comments must have over 3 characters");
    }
    await toast
      .promise(fetcher("PUT", `/posts/${post.id}/comments`, { content }), {
        success: "Success",
        loading: "Loading",
        error: (e) => e.message || "Something went wrong...",
      })
      .catch(() => setIsSubmitting(false))
      .finally(() => close());
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (textarea && textarea.current) {
      textarea.current.style.height = "0px";
      const scrollHeight = textarea.current.scrollHeight;
      textarea.current.style.height =
        Math.max(72, Math.min(scrollHeight, 170)) + "px";
    }
  }, [content]);

  return (
    <Dialog
      open={true}
      onClose={() => close()}
      initialFocus={textarea}
      className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg">
      <Dialog.Overlay />

      <div className="flex flex-row justify-between mb-2">
        <Dialog.Title className="font-bold text-xl">New Comment</Dialog.Title>
        <Cross className="w-6 cursor-pointer" onClick={() => close()} />
      </div>

      <div className="flex mb-8 gap-4">
        <img
          src={profilePicture}
          className="w-16 h-16 max-w-none object-cover rounded-md"
        />
        <textarea
          className="w-80 outline-none resize-none"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          ref={textarea}
          placeholder="Whats going on?"
        />
      </div>

      <div className="flex justify-center items-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => postComment()}
          className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Post comment
        </button>
      </div>
    </Dialog>
  );
}

function Posting({ close }: { close(): void }) {
  const textarea = useRef<any | undefined>();
  const uploadImg = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [imgs, setImgs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createPost() {
    setIsSubmitting(true);
    if (imgs.length < 1) {
      if (!createPostSchema.safeParse({ caption: content }).success) {
        setIsSubmitting(false);
        return toast.error("Caption must have over 3 characters");
      }
      await toast
        .promise(fetcher("PUT", "/posts", { caption: content }), {
          success: "Success",
          loading: "Loading",
          error: (e) => e.message || "Something went wrong...",
        })
        .catch(() => null)
        .finally(() => close());
    } else {
      const urls: string[] = [];
      for (let i = 0; i < imgs.length; i++) {
        const formData = new FormData();
        formData.append("file", imgs[i]);
        await fetch("/api/posts/imgs", {
          body: formData,
          method: "POST",
        })
          .then((res) => res.json())
          .then((newImg) => urls.push(newImg.Location));
      }

      type BodyData = {
        images: string[];
        caption?: string;
      };

      let data: BodyData = { images: urls };

      if (content.length > 0) {
        if (!createPostSchema.safeParse({ caption: content }).success)
          return toast.error("Caption must have over 3 characters");

        data = { ...data, caption: content };
      }

      return await toast
        .promise(fetcher("PUT", "/posts", data), {
          success: "Success",
          loading: "Loading",
          error: (e) => e.message || "Something went wrong...",
        })
        .catch(() => null)
        .finally(() => close());
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (textarea && textarea.current) {
      textarea.current.style.height = "0px";
      const scrollHeight = textarea.current.scrollHeight;
      textarea.current.style.height =
        Math.max(72, Math.min(scrollHeight, 170)) + "px";
    }
  }, [content]);

  useEffect(() => {
    if (imgs.length > 2) {
      toast.error("Only 2 images allowed");
      setImgs(imgs.splice(1));
    }
  }, [imgs]);

  return (
    <Dialog
      open={true}
      onClose={() => close()}
      initialFocus={textarea}
      className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg">
      <Dialog.Overlay />

      <input
        type="file"
        ref={uploadImg}
        onChange={(e) =>
          e.target.files && setImgs([...e.target.files, ...imgs])
        }
        className="hidden"
        accept=".png,.jpg,.jpeg"
        multiple
      />

      <div className="flex flex-row justify-between mb-2">
        <Dialog.Title className="font-bold text-xl">New Post</Dialog.Title>
        <Cross className="w-6 cursor-pointer" onClick={() => close()} />
      </div>

      {imgs.length > 0 && (
        <>
          <div
            className="flex flex-row gap-2 overflow-y-hidden"
            style={{ width: "calc(3rem + 1rem + 20rem + 4rem)" }}>
            {imgs.map((img) => (
              <img
                src={URL.createObjectURL(img)}
                className="mt-2 h-40 rounded-md object-cover self-center"
              />
            ))}
          </div>
        </>
      )}

      <div className={`flex mb-8 ${imgs ? "mt-6" : "mt-2"} gap-4`}>
        <img
          src={profilePicture}
          className="w-16 h-16 max-w-none object-cover rounded-md"
        />
        <textarea
          className="w-80 outline-none resize-none"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          ref={textarea}
          placeholder="Whats going on?"
        />
      </div>

      <div className="flex justify-center gap-4 items-center">
        <div className="rounded-full flex h-12 p-3 justify-center items-center bg-gray-900 cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <GridAdd
            className="h-full text-white"
            onClick={() => uploadImg!.current.click()}
          />
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => createPost()}
          className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create post
        </button>
      </div>
    </Dialog>
  );
}
