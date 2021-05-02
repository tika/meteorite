import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost } from "@components/post";
import { Feed } from "@components/pages/feed";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";

type HomeProps = {
  user: JWTPayload;
  posts: extendedPost[];
};

export default function Home(props: HomeProps) {
  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

  useEffect(() => {
    handleScrollPosition();
    window.onscroll = () => {
      if (window.pageYOffset > 0)
        sessionStorage.setItem(
          "homeScrollPosition",
          window.pageYOffset.toString()
        );
    };
  }, [props]);

  function handleScrollPosition() {
    const scrollPos = sessionStorage.getItem("homeScrollPosition");
    if (scrollPos) {
      window.scrollTo(0, parseFloat(scrollPos));
      sessionStorage.removeItem("homeScrollPosition");
    }
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
      <Feed
        posts={props.posts}
        user={props.user}
        setCommentingOnPost={(p) => {
          setPopup("commenting");
          setPopupData(p);
        }}
      />
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

  const posts: extendedPost[] | null = await prisma.post.findMany({
    // where: { authorId: user.id },
    include: { comments: true, likedBy: true, savedBy: true },
  });

  let diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return { props: { user, posts: JSON.parse(JSON.stringify(diffPosts)) } };
};
