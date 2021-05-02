import { Notification, Post } from ".prisma/client";
import { fetcher } from "@app/fetcher";
import useSWR from "swr";
import { SafeUser } from "./post";
import Saved from "../pages/saved";
import { Heart } from "./svg/heart";

export function NotificationElement({
  notification,
}: {
  notification: Notification;
}) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${notification.authorId}`,
    (url) => fetcher("GET", url)
  );

  const t = useSWR<Post>(
    `/${notification.contentType}s/${notification.contentId}`,
    (url) => fetcher("GET", url)
  );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  return (
    <>
      {false ? (
        <h1>loading..</h1>
      ) : (
        <div className="flex w-96 gap-2 items-center">
          <div className="max-w-full max-h-sm">
            <img
              src={profilePicture}
              className="w-16 h-16 max-w-none object-cover rounded-md"
            />
          </div>
          <div className="w-80">
            <div className="flex gap-1 items-center">
              <span className="font-semibold">@{data?.username}</span>
              <p>
                {notification.action == "like" && "liked"} your{" "}
                {notification.contentType}
              </p>
              <Heart className="h-5" isLiked={true} />
            </div>

            <div className="line-clamp-1 text-gray-500">
              <p>{t.data?.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
