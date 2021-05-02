import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { Notification } from ".prisma/client";
import { NotificationElement } from "../components/notificationelement";

type HomeProps = {
  user: JWTPayload;
  notifications: Notification[];
};

export default function Notifications(props: HomeProps) {
  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

  useEffect(() => {
    handleScrollPosition();
    window.onscroll = () => {
      if (window.pageYOffset > 0)
        sessionStorage.setItem(
          "notificationsScrollPosition",
          window.pageYOffset.toString()
        );
    };
  }, [props]);

  function handleScrollPosition() {
    const scrollPos = sessionStorage.getItem("notificationsScrollPosition");
    if (scrollPos) {
      window.scrollTo(0, parseFloat(scrollPos));
      sessionStorage.removeItem("notificationsScrollPosition");
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
      <div className="flex justify-center col-span-12 sm:col-span-6">
        <div className="w-96 flex items-center flex-col py-8 gap-10 ">
          <div className="w-96 -mb-4">
            <h1 className="font-bold text-xl">Your notifications</h1>
          </div>
          <div className="flex w-full flex-col gap-4">
            {props.notifications &&
              props.notifications.map((notifi) => (
                <NotificationElement notification={notifi} />
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

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // const posts: extendedPost[] | null = await prisma.post.findMany({
  //   where: { authorId: user.id },
  //   include: { comments: true, likedBy: true, savedBy: true },
  // });

  const notifications = await prisma.notification.findMany({
    where: {
      notifiedUserId: user.id,
    },
  });

  // let diffPosts: any[] = posts;
  // diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return {
    props: { user, notifications: JSON.parse(JSON.stringify(notifications)) },
  };
};
