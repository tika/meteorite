import { GetServerSideProps } from "next";
import { useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, PostElement } from "@components/post";
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
      {props.post.images}
      <Right />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  let post = await prisma.post.findFirst({
    where: { id: ctx.query.post as string },
    include: { comments: true, likedBy: true },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return { props: { user, post: JSON.parse(JSON.stringify(post)) } };
};
