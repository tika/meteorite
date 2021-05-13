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
import { useRouter } from "next/dist/client/router";
import { santiseUser, santisePosts } from "@app/santise";
import { fetcher } from "@app/fetcher";

type ProfileProps = {
  user: JWTPayload;
  profile: SafeUser & {
    followerOf: SafeUser[];
    followers: SafeUser[];
  };
  posts: extendedPost[];
};

export default function ProfilePage(props: ProfileProps) {
  const [popup, setPopup] = useState<PopupState>();
  const [popupData, setPopupData] = useState<any | undefined>();
  const [follows, setFollows] = useState(false);
  const router = useRouter();

  const profileBanner =
    "https://www.onthegotours.com/blog/wp-content/uploads/2019/08/Oasis-over-Sand-dunes-in-Erg-Chebbi-of-Sahara-desert-in-Morocco-Africa.jpg";

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  useEffect(() => {
    if (!props.user) router.push("/");
    window.scrollTo(0, 0); // Scroll to top
  }, [props]);

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
        <div className="w-96 flex items-center flex-col py-8 gap-4">
          <div className="relative flex justify-center">
            <img src={profileBanner} className="object-cover h-64" />
            <h1
              style={{ writingMode: "vertical-rl" }}
              className="absolute left-2 bottom-2 font-bold text-sm text-white transform rotate-180 z-20">
              @{props.profile.username}
            </h1>

            <div className="max-w-full max-h-sm absolute left-10 rounded-md border-white border-4 -bottom-4">
              <img
                src={profilePicture}
                className="w-20 h-20 max-w-none object-cover rounded-md"
              />
            </div>
          </div>
          <div className="py-4 px-4 flex flex-col gap-4">
            <div className="flex justify-between">
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
            <p className="text-md font-medium">
              Embedded software; CoderDojoDC; Creator and co-author of the
              Nerves Project; Marathon running
            </p>

            <div className="flex gap-4 items-center">
              <button
                disabled={props.user.id === props.profile.id}
                onClick={() => {
                  fetcher(
                    follows ? "DELETE" : "PUT",
                    `/users/${props.user.id}/follow`,
                    { userId: props.profile.id }
                  );
                  setFollows(!follows);
                }}
                type="button"
                className="justify-center w-40 text-white items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {follows ? "Unfollow" : "Follow"}
              </button>

              <Dots className="h-6 text-black" />
            </div>
            <div className="flex justify-between mt-5">
              <h1 className="font-semibold cursor-pointer">
                {props.profile.followerOf.length}{" "}
                <span className="text-gray-500 font-medium">Following</span>
              </h1>
              <h1 className="font-semibold cursor-pointer">
                {props.profile.followers.length}{" "}
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
                user={props.profile}
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
    include: { followerOf: true, followers: true },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  let posts = await prisma.post.findMany({
    where: { authorId: ctx.query.id as string },
    include: { likedBy: true, savedBy: true },
  });

  return {
    props: {
      user,
      profile: JSON.parse(JSON.stringify(santiseUser(profile))),
      posts: JSON.parse(JSON.stringify(santisePosts(posts))),
    },
  };
};
