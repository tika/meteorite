import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, SafeUser } from "@components/post";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";
import { Popup, PopupState } from "@components/popup";
import { Fire } from "@components/svg/fire";
import { Calendar } from "@components/svg/calendar";
import { Pin } from "@components/svg/pin";
import { Dots } from "@components/svg/dots";
import { Feed } from "@components/pages/feed";

type ProfileProps = {
  user: JWTPayload;
  profile: SafeUser;
  posts: extendedPost[];
};

export default function ProfilePage(props: ProfileProps) {
  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();

  const profileBanner =
    "https://www.onthegotours.com/blog/wp-content/uploads/2019/08/Oasis-over-Sand-dunes-in-Erg-Chebbi-of-Sahara-desert-in-Morocco-Africa.jpg";

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  useEffect(() => window.scrollTo(0, 0), []); // Scroll to top

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
          <div className="relative flex justify-center">
            <img src={profileBanner} className="object-cover rounded-md h-64" />
            <div className="absolute px-4 w-5/6 py-2 bg-white rounded-lg -bottom-10 flex items-center gap-2">
              <div className="max-w-full max-h-sm">
                <img
                  src={profilePicture}
                  className="w-16 h-16 max-w-none object-cover rounded-md"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg">@{props.user.username}</h1>
                <div className="flex items-center">
                  <Fire className="w-5" />
                  <h2 className="font-semibold text-sm">#14 in the world</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4 px-4 flex flex-col gap-4">
            <p className="text-md font-medium">
              Embedded software; CoderDojoDC; Creator and co-author of the
              Nerves Project; Marathon running
            </p>
            <div className="flex justify-evenly">
              <div className="flex items-center gap-2">
                <Pin className="h-6 text-blue-700" />
                <h1 className="font-semibold">London</h1>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 text-blue-700" />
                <h1>
                  Joined <span className="font-semibold">June 2021</span>
                </h1>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Follow
              </button>
              <div className="rounded-full flex h-12 p-3 justify-center items-center bg-gray-900 cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Dots className="h-full text-white" />
              </div>
            </div>
            <div className="flex justify-between mt-5">
              <h1 className="font-semibold cursor-pointer">
                164 <span className="text-gray-500 font-medium">Following</span>
              </h1>
              <h1 className="font-semibold cursor-pointer">
                6.6M{" "}
                <span className="text-gray-500 font-medium">Followers</span>
              </h1>
              <h1 className="font-semibold cursor-pointer">
                {props.posts.length}{" "}
                <span className="text-gray-500 font-medium">Posts</span>
              </h1>
            </div>
            <div className="flex w-full justify-center mt-4">
              <div
                className="w-5/6 bg-gray-400 rounded-lg"
                style={{ height: "2px" }}
              />
            </div>
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

  let posts = await prisma.post.findMany({
    where: { authorId: ctx.query.id as string },
    include: { likedBy: true, savedBy: true },
  });

  let diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return {
    props: {
      user,
      profile: JSON.parse(JSON.stringify(rest)),
      posts: JSON.parse(JSON.stringify(diffPosts)),
    },
  };
};
