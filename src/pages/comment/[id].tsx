import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedComment, extendedPost, PostElement } from "@components/post";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { CommentElement } from "@components/commentelement";
import toast from "react-hot-toast";
import { fetcher } from "@app/fetcher";

type CommentPageProps = {
  user: JWTPayload;
  comment: extendedComment;
  replies: extendedComment[];
};

export default function PostPage(props: CommentPageProps) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log(props.comments);

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

  // async function postComment() {
  //   setIsSubmitting(true);
  //   if (!createCommentSchema.safeParse({ content }).success) {
  //     setIsSubmitting(false);
  //     return toast.error("Comments must have over 3 characters");
  //   }
  //   await toast
  //     .promise(
  //       fetcher("PUT", `/posts/${props.post.id}/comments`, { content }),
  //       {
  //         success: "Success",
  //         loading: "Loading",
  //         error: (e) => e.message || "Something went wrong...",
  //       }
  //     )
  //     .catch(() => setIsSubmitting(false))
  //     .finally(() => setContent(""));
  //   setIsSubmitting(false);
  // }

  console.log(props.replies);

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
          <h1>{props.replies.length}</h1>
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
