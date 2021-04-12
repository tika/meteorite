import { Comment } from ".prisma/client";
import { fetcher } from "@app/fetcher";
import { autoDatify } from "@app/timeutils";
import React from "react";
import useSWR from "swr";
import { SafeUser } from "@components/post";
import HashLoader from "react-spinners/HashLoader";

export function CommentElement({ comment }: { comment: Comment }) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${comment.authorId}`,
    (url) => fetcher("GET", url)
  );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  return (
    <>
      {!data ? (
        <div className="flex flex-row justify-center items-center">
          <HashLoader color="#3B82F6" loading={!data} size={10} />
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <img
            src={profilePicture}
            className="rounded-md w-12 h-12 object-cover"
          />
          <div className="flex flex-col">
            <p>{comment.content}</p>
            <p className="font-semibold text-sm">
              {data?.username} - {autoDatify(new Date(comment.createdAt))}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
