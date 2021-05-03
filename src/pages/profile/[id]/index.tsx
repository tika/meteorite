import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, SafeUser } from "@components/post";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";

type ProfileProps = {
  user: JWTPayload;
  profile: SafeUser;
};

export default function ProfilePage(props: ProfileProps) {
  const textarea = useRef<any | undefined>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

  const profileBanner =
    "https://www.onthegotours.com/blog/wp-content/uploads/2019/08/Oasis-over-Sand-dunes-in-Erg-Chebbi-of-Sahara-desert-in-Morocco-Africa.jpg";

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
          <div className="relative">
            <img src={profileBanner} className="object-cover rounded-md h-64" />
            <div className="absolute px-4 py-2 bg-white rounded-lg -bottom-10 transform -translate-x-1/2 md:transform-none left-1/2 md:left-5 flex items-center gap-2">
              <div className="max-w-full max-h-sm">
                <img
                  src={profilePicture}
                  className="w-16 h-16 max-w-none object-cover rounded-md"
                />
              </div>
              <div>
                <h1 className="font-semibold">@{props.user.username}</h1>
                <h2>Joined 16th October</h2>
              </div>
            </div>
          </div>
          <div className="py-4 px-3">
            <p className="text-sm">
              Embedded software; CoderDojoDC; Creator and co-author of the
              Nerves Project; Marathon running
            </p>
          </div>
        </div>
      </div>
      <Right />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  let profile = await prisma.user.findFirst({
    where: { id: ctx.query.id as string },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  const { password, email, ...rest } = profile;

  return { props: { user, profile: JSON.parse(JSON.stringify(rest)) } };
};
