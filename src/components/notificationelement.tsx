import { Notification, Post } from ".prisma/client";
import { fetcher } from "@app/fetcher";
import useSWR from "swr";
import { SafeUser } from "./post";
import Saved from "../pages/saved";
import { Heart } from "./svg/heart";
import { useRouter } from "next/dist/client/router";
import PuffLoader from "react-spinners/PuffLoader";
import { extendedNotification } from "../pages/notifications";

export function NotificationElement({
  notification: props,
}: {
  notification: extendedNotification;
}) {
  // const { data, error } = useSWR<SafeUser>(
  //   `/users?id=${notification.authorId}`,
  //   (url) => fetcher("GET", url)
  // );

  // const post = useSWR<Post>(
  //   `/${notification.contentType}s/${notification.contentId}`,
  //   (url) => fetcher("GET", url)
  // );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const router = useRouter();

  return (
    <>
      {false ? (
        <> </>
      ) : (
        // <div className="flex flex-row justify-center items-center">
        //   <PuffLoader color="#3B82F6" loading={true} />
        // </div>
        <div
          className="flex w-96 gap-2 items-center cursor-pointer"
          onClick={() =>
            router.push(`/${props.contentType}/${props.contentId}`)
          }>
          <div className="max-w-full max-h-sm">
            <img
              src={profilePicture}
              className="w-16 h-16 max-w-none object-cover rounded-md"
            />
          </div>
          <div className="w-80">
            <div className="flex gap-1 items-center">
              <span className="font-semibold">@{props.author.username}</span>
              <p>
                {props.action == "like" && "liked"} your {props.contentType}
              </p>
              <Heart className="h-5" isLiked={true} />
            </div>

            <div className="line-clamp-1 text-gray-500">
              <p>{props.content.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
