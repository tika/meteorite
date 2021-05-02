import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { Notification, Post } from ".prisma/client";
import { NotificationElement } from "../components/notificationelement";
import { fetcher } from "@app/fetcher";
import { SafeUser } from "@components/post";

type NotificationProps = {
  user: JWTPayload;
  notifications: extendedNotification[];
};

export type extendedNotification = Notification & {
  author: SafeUser;
  content: Post;
};

export default function Notifications(props: NotificationProps) {
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

  let notifications: any[] = await prisma.notification.findMany({
    where: {
      notifiedUserId: user.id,
    },
    include: {
      author: true,
    },
  });

  notifications = await Promise.all(
    notifications.map(async (n) => {
      const t = await prisma.post.findFirst({ where: { id: n.contentId } });
      n.content = t;
      const { email, password, ...rest } = n.author;
      n.author = rest;
      return n;
    })
  );

  return {
    props: { user, notifications: JSON.parse(JSON.stringify(notifications)) },
  };
};
