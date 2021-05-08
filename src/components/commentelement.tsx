import { fetcher } from "@app/fetcher";
import { autoDatify } from "@app/timeutils";
import React, { useState } from "react";
import useSWR from "swr";
import { extendedComment, SafeUser } from "@components/post";
import HashLoader from "react-spinners/HashLoader";
import { Bullet } from "./svg/bullet";
import { Heart } from "./svg/heart";
import { Chat } from "./svg/chat";
import { Multiline } from "@app/elementutils";

interface CommentProps {
  comment: extendedComment;
  currentUser: SafeUser;
  hideCommentIcon?: boolean;
}

export function CommentElement(props: CommentProps) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${props.comment.authorId}`,
    (url) => fetcher("GET", url)
  );

  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(
    props.comment.likedBy.filter((u) => u.id === props.currentUser.id).length >
      0
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
                {autoDatify(new Date(props.comment.createdAt))}
              </p>
            </div>
            <Multiline
              text={props.comment.content}
              onClick={() => !expanded && setExpanded(true)}
              lineclamp={2}
              expanded={expanded}
            />
            <div className="flex items-center w-full gap-4 mt-2">
              <div className="flex">
                <Heart
                  className="h-6"
                  isLiked={isLiked}
                  onClick={() => {
                    fetcher(
                      isLiked ? "DELETE" : "PUT",
                      `/comments/likes/${props.comment.id}`
                    );
                    setIsLiked(!isLiked);
                  }}
                />
                {props.comment.likedBy.length} likes
              </div>
              {!props.hideCommentIcon && (
                <div className="flex">
                  <Chat className="h-6" />
                  {props.comment.childComments.length} replies
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
