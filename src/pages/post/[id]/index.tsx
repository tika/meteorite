import { GetServerSideProps } from "next";
import { useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, ImagePost, PostElement } from "@components/post";
import { Feed } from "@components/pages/feed";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";

type HomeProps = {
  user: JWTPayload;
  post: extendedPost;
};

export default function PostPage(props: HomeProps) {
  const [commentingOnPost, setCommentingOnPost] = useState<extendedPost>();
  const [popup, setPopup] = useState<PopupState>();

  return (
    <div className="h-full grid grid-cols-12 max-w-full">
      {popup && (
        <Popup closeThis={() => setPopup(undefined)} currentPopup={popup} />
      )}
      <Left user={props.user} onPost={() => setPopup("posting")} />
      <div className="flex justify-center col-span-12 sm:col-span-6">
        <div className="w-96 flex items-center flex-col py-8 gap-10 ">
          <PostElement
            setCommentingOnPost={(p: extendedPost) => setCommentingOnPost(p)}
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
          <div className="w-full bg-gray-500" style={{ height: "1px" }} />
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
