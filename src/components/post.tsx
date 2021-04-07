import { Post, User } from ".prisma/client";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@app/fetcher";
import ClipLoader from "react-spinners/ClipLoader";
import { Chat } from "@components/svg/chat";
import { Heart } from "@components/svg/heart";
import { Bookmark } from "@components/svg/bookmark";

interface PostProps {
  post: Post;
  key: string;
}

export function PostElement(props: PostProps) {
  const { data, error } = useSWR<Omit<User, "password" | "email">>(
    `/users?id=${props.post.authorId}`,
    (url) => fetcher("GET", url)
  );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1546587348-d12660c30c50?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjV8fG5hdHVyYWx8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://www.wbcsd.org/var/site/storage/images/media/page-assets/new-projects/nature-action/science-based-targets-for-nature/154616-1-eng-GB/Science-based-Targets-for-Nature_720_square.jpg",
    "https://www.happybrainscience.com/wp-content/uploads/2017/07/derwent-morning-Cropped.jpg",
  ]);

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {!data ? (
        <ClipLoader loading={!data} size={150} />
      ) : (
        <div key={props.key}>
          <div className="mb-2 relative">
            <h1
              style={{ writingMode: "vertical-rl" }}
              className="absolute bottom-6 font-bold text-white transform rotate-180"
            >
              @{data.username}
            </h1>
            <img
              src={images[1]}
              className="w-96 h-96 object-cover rounded-md"
            />
          </div>
          <div className="w-96 flex flex-row items-start gap-2">
            <img src={profilePicture} className="w-16 rounded-md" />
            <div className="flex flex-col gap-1 w-full">
              <p
                onClick={() => !expanded && setExpanded(true)}
                className={`line-clamp-${expanded ? "none" : "3"}`}
              >
                {props.post.caption?.split("\n").map((line) => (
                  <p className="text-sm">{line}</p>
                ))}
              </p>

              <div className="flex">
                <Chat className="h-6" />
                <Heart className="h-6" />
                <Bookmark className="h-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
