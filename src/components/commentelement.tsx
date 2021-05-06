import { fetcher } from "@app/fetcher";
import { autoDatify } from "@app/timeutils";
import React, { useState } from "react";
import useSWR from "swr";
import { extendedComment, SafeUser } from "@components/post";
import HashLoader from "react-spinners/HashLoader";
import { Bullet } from "./svg/bullet";
import { Heart } from "./svg/heart";
import { Chat } from "./svg/chat";

export function CommentElement({ comment }: { comment: extendedComment }) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${comment.authorId}`,
    (url) => fetcher("GET", url)
  );

  const [expanded, setExpanded] = useState(false);

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  return (
    <>
      {!data ? (
        <div className="flex flex-row justify-center items-center">
          <HashLoader color="#3B82F6" loading={!data} size={10} />
        </div>
      ) : (
        <div className="flex flex-row gap-2 w-full">
          <div className="max-w-full max-h-sm">
            <img
              src={profilePicture}
              className="w-16 h-16 max-w-none object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-semibold">@{data.username}</p>
              <Bullet />
              <p className="font-semibold text-sm text-gray-600">
                {autoDatify(new Date(comment.createdAt))}
              </p>
            </div>
            <div
              onClick={() => !expanded && setExpanded(true)}
              className={`line-clamp-${expanded ? "none" : "2"}`}>
              {comment.content
                .trim()
                .split("\n")
                .map((line) => {
                  return (
                    <>
                      <p className="text-md break-words">{line}</p>
                      {line === "" && <br />}
                    </>
                  );
                })}
            </div>
            <div className="flex items-center w-full gap-4 mt-2">
              <div className="flex">
                <Heart className="h-6" isLiked={false} onClick={() => null} />
                {comment.likedBy.length} likes
              </div>
              <div className="flex">
                <Chat className="h-6" />
                {comment.childComments.length} replies
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
