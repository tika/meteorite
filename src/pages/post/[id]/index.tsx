import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, ImagePost, PostElement } from "@components/post";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { CommentElement } from "@components/commentelement";
import { createCommentSchema } from "../../../schemas/posts";
import toast from "react-hot-toast";
import { fetcher } from "@app/fetcher";

type HomeProps = {
  user: JWTPayload;
  post: extendedPost;
};

export default function PostPage(props: HomeProps) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  useEffect(() => {
    if (textarea && textarea.current) {
      textarea.current.style.height = "0px";
      const scrollHeight = textarea.current.scrollHeight;
      textarea.current.style.height =
        Math.max(72, Math.min(scrollHeight, 170)) + "px";
    }
  }, [content]);

  async function postComment() {
    setIsSubmitting(true);
    if (!createCommentSchema.safeParse({ content }).success) {
      setIsSubmitting(false);
      return toast.error("Comments must have over 3 characters");
    }
    await toast
      .promise(
        fetcher("PUT", `/posts/${props.post.id}/comments`, { content }),
        {
          success: "Success",
          loading: "Loading",
          error: (e) => e.message || "Something went wrong...",
        }
      )
      .catch(() => setIsSubmitting(false))
      .finally(() => setContent(""));
    setIsSubmitting(false);
  }

  return (
    <div className="h-full grid grid-cols-12 max-w-full">
      {popup && (
        <Popup
          closeThis={() => setPopup(undefined)}
          currentData={popupData}
          currentPopup={popup}
        />
      )}
      <Left user={props.user} onPost={() => setPopup("posting")} />
      <div className="flex justify-center col-span-12 sm:col-span-6">
        <div className="w-96 flex items-center flex-col py-8 gap-10 ">
          <PostElement
            setCommentingOnPost={(p: extendedPost) => {
              setPopup("commenting");
              setPopupData(p);
            }}
            currentUser={props.user}
            post={props.post}
            key={props.post.id}
          />
          <div className="flex justify-between items-center w-full">
            <p className="font-semibold">{props.post.likedBy.length} likes</p>
            <p className="font-semibold">
              {props.post.comments.length} comments
            </p>
            <p className="font-semibold">0 saves</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-4 items-center">
              <div className="max-w-full max-h-sm">
                <img
                  src={profilePicture}
                  className="w-16 h-16 max-w-none object-cover rounded-md"
                />
              </div>
              <textarea
                className="w-80 outline-none resize-none"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                ref={textarea}
                placeholder={`Comment as @${props.user.username}`}
              />
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => postComment()}
              className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Post comment
            </button>
          </div>
          <div className="w-full bg-gray-500 -mt-4" style={{ height: "1px" }} />
          <div className="flex w-full flex-col gap-4">
            {props.post.comments.map((comment) => (
              <CommentElement comment={comment} />
            ))}
          </div>
        </div>
      </div>
      <Right />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  let post = await prisma.post.findFirst({
    where: { id: ctx.query.id as string },
    include: { comments: true, likedBy: true },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return { props: { user, post: JSON.parse(JSON.stringify(post)) } };
};
