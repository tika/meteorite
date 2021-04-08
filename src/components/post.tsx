import { Post, User } from ".prisma/client";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@app/fetcher";
import ClipLoader from "react-spinners/ClipLoader";
import { Chat } from "@components/svg/chat";
import { Heart } from "@components/svg/heart";
import { Bookmark } from "@components/svg/bookmark";
import { motion } from "framer-motion";

interface PostProps {
  post: Post;
  currentUser: User;
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

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [goingUp, setGoingUp] = useState(false);

  return (
    <>
      {!data ? (
        <ClipLoader loading={!data} size={150} />
      ) : (
        <div key={props.key}>
          <div className="mb-4 relative">
            <div className="w-full absolute bottom-6 flex flex-row justify-between">
              <h1
                style={{ writingMode: "vertical-rl" }}
                className="font-bold text-white transform rotate-180 z-10"
              >
                @{data.username}
              </h1>
              <div className="mr-2 px-1 py-3 z-10 flex flex-col gap-2 bg-gray-900 opacity-90 rounded-full">
                {Array.from(Array(images.length)).map((x, i) => (
                  <div
                    className={`w-2 h-2 transition ease-in-out duration-500 ${
                      i === index ? "bg-blue-300" : "bg-gray-600"
                    } rounded-full`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 w-96 h-96">
              <motion.div
                style={{ backgroundImage: `url(${images[index]})` }}
                className="object-cover z-0 w-96 h-96 bg-no-repeat bg-cover bg-center"
                layout
                drag="y"
                dragMomentum={true}
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                onDragStart={(event, info) => setStartPos(info.point.y)}
                onDrag={(event, info) => {
                  const required = 150;
                  const newPos = info.point.y;

                  if (newPos - startPos < -required) {
                    // Swipe up
                    // setIndex((index == 0 ? images.length : index) - 1);
                    setGoingUp(true);
                  } else if (newPos - startPos > required) {
                    // Swipe down
                    // setIndex(index == images.length - 1 ? 0 : index + 1);
                    setGoingUp(false);
                  }
                }}
                onDragEnd={(event, info) => {
                  const required = 150;
                  const newPos = info.point.y;

                  if (newPos - startPos < -required) {
                    // Swipe up
                    setIndex((index == 0 ? images.length : index) - 1);
                  } else if (newPos - startPos > required) {
                    // Swipe down
                    setIndex(index == images.length - 1 ? 0 : index + 1);
                  }

                  setStartPos(0);
                }}
              />
            </div>
            <img
              src={
                images[
                  goingUp
                    ? (index == 0 ? images.length : index) - 1
                    : index == images.length - 1
                    ? 0
                    : index + 1
                ]
              }
              className="transition ease-in-out duration-1000 w-96 h-96 object-cover"
            />
          </div>

          <div className="w-96 flex flex-row items-start gap-4 self-center">
            <div className="max-w-full max-h-sm">
              <img
                src={profilePicture}
                className="w-20 h-20 max-w-none object-cover rounded-md"
              />
            </div>

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
