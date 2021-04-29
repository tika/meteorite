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
  posts: extendedPost[];
};

export default function Saved(props: HomeProps) {
  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

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
      {props.posts && (
        <Feed
          posts={props.posts}
          user={props.user}
          setCommentingOnPost={(p) => {
            setPopup("commenting");
            setPopupData(p);
          }}
        />
      )}

      <Right />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // TODO: Filter in query
  let posts = await prisma.post.findMany({
    include: {
      comments: true,
      likedBy: true,
      savedBy: true,
    },
  });

  posts = posts.filter(
    (p) => p.savedBy.filter((u) => u.id === user.id).length > 0
  );

  let diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return { props: { user, posts: JSON.parse(JSON.stringify(diffPosts)) } };
};
