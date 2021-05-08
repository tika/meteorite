import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedComment } from "@components/post";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { CommentElement } from "@components/commentelement";
import { Bullet } from "@components/svg/bullet";

type CommentPageProps = {
  user: JWTPayload;
  comment: extendedComment;
  replies: extendedComment[];
};

export default function PostPage(props: CommentPageProps) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");

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
        <div className="w-96 flex items-center flex-col py-8 gap-10">
          <CommentElement
            currentUser={props.user}
            comment={props.comment}
            hideCommentIcon
          />

          <div className="flex w-full gap-2 flex-col">
            <div
              className="w-full bg-gray-500 mt-4"
              style={{ height: "2px" }}
            />
            <div className="flex gap-2 items-center">
              <h1 className="font-semibold">{props.replies.length} replies</h1>
              <Bullet className="text-gray-500" />
              <h1 className="text-gray-500 cursor-pointer">
                Sorted by <span className="text-blue-500">date</span>
              </h1>
            </div>
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
                placeholder={`Reply to @${props.comment.author?.username}`}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {props.replies.map((reply) => (
              <CommentElement
                key={reply.id}
                currentUser={props.user}
                comment={reply}
                hideCommentIcon
              />
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

  let currentComment = await prisma.comment.findFirst({
    where: { id: ctx.query.id as string },
    include: {
      likedBy: true,
      parentComment: true,
      author: true,
      childComments: {
        include: {
          likedBy: true,
        },
      },
    },
  });

  if (!currentComment) {
    return {
      notFound: true,
    };
  }

  if (currentComment.parentComment) {
    return {
      redirect: {
        destination: `/comment/${currentComment.parentCommentId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      comment: JSON.parse(JSON.stringify(currentComment)),
      replies: JSON.parse(JSON.stringify(currentComment.childComments)),
    },
  };
};
