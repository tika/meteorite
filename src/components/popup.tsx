import React, { useRef, useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Cross } from "./svg/cross";
import toast from "react-hot-toast";
import { GridAdd } from "./svg/gridadd";
import { createPostSchema } from "../schemas/posts";
import { fetcher } from "@app/fetcher";

export type PopupState = "posting" | undefined;

interface PopupProps {
  currentPopup: PopupState;
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
      <div
        className="h-screen w-full z-40 bg-black opacity-70"
        onClick={() => props.closeThis()}
      />
      <RemoveScrollBar />
    </div>
  );
}

function Posting({ close }: { close(): void }) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [imgs, setImgs] = useState([
    // profilePicture,
    // profilePicture,
    // "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg",
    // "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    // profilePicture,
  ]);

  async function createPost() {
    if (imgs.length < 1) {
      if (!createPostSchema.safeParse({ caption: content }).success)
        return toast.error("Caption must have over 3 characters");
      await toast
        .promise(fetcher("PUT", "/posts", { caption: content }), {
          success: "Success",
          loading: "Loading",
          error: (e) => e.message || "Something went wrong...",
        })
        .catch(() => null)
        .finally(() => close());
    }
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
      // setImgs(imgs.splice(1));
    }
  }, [imgs]);

  return (
    <Dialog
      open={true}
      onClose={() => close()}
      initialFocus={textarea}
      className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg">
      <Dialog.Overlay />

      <div className="flex flex-row justify-between mb-2">
        <Dialog.Title className="font-bold text-xl">New Post</Dialog.Title>
        <Cross className="w-6 cursor-pointer" onClick={() => close()} />
      </div>

      {imgs.length > 0 && (
        <>
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Images:</p>
            <button className="flex gap-1 text-blue-600 focus:outline-none">
              <GridAdd className="w-6" />
              <h1>Attach Image</h1>
            </button>
          </div>

          <div
            className="flex flex-row gap-2 overflow-y-hidden"
            style={{ width: "calc(3rem + 1rem + 20rem + 4rem)" }}>
            {imgs.map((src) => (
              <img
                src={src}
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

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => createPost()}
          className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create post
        </button>
      </div>
    </Dialog>
  );
}
