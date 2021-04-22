import { Comment, Post, User } from ".prisma/client";
import React, { useState, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@app/fetcher";
import HashLoader from "react-spinners/HashLoader";
import { Chat } from "@components/svg/chat";
import { Heart } from "@components/svg/heart";
import { Bookmark } from "@components/svg/bookmark";
import { motion } from "framer-motion";
import { autoDatify } from "@app/timeutils";
import { Bullet } from "@components/svg/bullet";
import FastAverageColor from "fast-average-color";
import { useEffect } from "react";

export type SafeUser = Omit<User, "password" | "email">;

export type extendedPost = Post & { likedBy: User[]; comments: Comment[] };

interface PostProps {
  post: extendedPost;
  currentUser: SafeUser;
  key: string;
  setCommentingOnPost(post: extendedPost): void;
}

export function PostElement(props: PostProps) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${props.post.authorId}`,
    (url) => fetcher("GET", url)
  );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1546587348-d12660c30c50?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjV8fG5hdHVyYWx8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://www.wbcsd.org/var/site/storage/images/media/page-assets/new-projects/nature-action/science-based-targets-for-nature/154616-1-eng-GB/Science-based-Targets-for-Nature_720_square.jpg",
    "https://www.happybrainscience.com/wp-content/uploads/2017/07/derwent-morning-Cropped.jpg",
    "https://miro.medium.com/max/6494/0*mi1X66cRuXRVLfKT",
  ]);

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [next, setNext] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [averageColor, setAverageColor] = useState<IFastAverageColorResult>();
  const imgRef = useRef<any>();

  useEffect(() => {
    const fac = new FastAverageColor();
    if (imgRef) {
      fac.getColorAsync(imgRef.current).then((color) => setAverageColor(color));
    }
  }, [images, index]);

  const [isLiked, setIsLiked] = useState(
    props.post.likedBy.filter((u) => u.id === props.currentUser.id).length > 0
  );

  return (
    <>
      {!data ? (
        <div className="flex flex-row justify-center items-center">
          <HashLoader color="#3B82F6" loading={!data} size={100} />
        </div>
      ) : (
        <div className="w-96" key={props.key}>
          {/* Purely used for average color */}
          <img src={images[index]} ref={imgRef} className="hidden" />

          <div className="mb-4 relative">
            <div className="w-full absolute bottom-6 flex flex-row justify-between">
              <h1
                style={{ writingMode: "vertical-rl" }}
                className="font-bold text-white transform rotate-180 z-20">
                @{data.username}
              </h1>
              {images.length > 1 && (
                <div className="mr-2 px-1 py-3 z-20 flex flex-col gap-2 bg-gray-900 opacity-90 rounded-full">
                  {images.map((x, i) => (
                    <div
                      className={`w-2 h-2 transition ease-in-out duration-500 ${
                        i === index ? "bg-blue-300" : "bg-gray-600"
                      } rounded-full`}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full h-96 bg-gray-100 shadow-sm rounded-lg">
              <Bookmark
                className={`absolute top-5 right-5 z-20 w-6 ${
                  averageColor?.isDark ? "text-white" : "text-dark"
                }`}
              />
              <div className="absolute top-0 z-10 left-0 w-96 h-96">
                <motion.div
                  style={{ backgroundImage: `url(${images[index]})` }}
                  className="object-cover rounded-lg w-96 h-96 bg-no-repeat bg-cover bg-center"
                  layout
                  drag={images.length > 1 ? "y" : false}
                  dragMomentum={true}
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  onDragStart={(event, info) => setStartPos(info.point.y)}
                  onDrag={(event, info) => {
                    const newPos = info.point.y;
                    setCurrentPos(newPos);

                    if (newPos - startPos < 0) {
                      // Swipe up
                      setNext(index == images.length - 1 ? 0 : index + 1);
                    } else if (newPos - startPos > 0) {
                      // Swipe down
                      setNext((index == 0 ? images.length : index) - 1);
                    }
                  }}
                  onDragEnd={(event, info) => {
                    const required = 150;
                    const newPos = info.point.y;

                    if (newPos - startPos < -required) {
                      // Swipe up
                      setIndex(index == images.length - 1 ? 0 : index + 1);
                    } else if (newPos - startPos > required) {
                      // Swipe down
                      setIndex((index == 0 ? images.length : index) - 1);
                    }

                    setStartPos(Math.abs(newPos + startPos - required));
                    setCurrentPos(384);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-96 flex flex-row items-start gap-4 self-center">
            <div className="max-w-full max-h-sm">
              <img
                src={profilePicture}
                className="w-20 h-20 max-w-none object-cover rounded-md"
              />
            </div>

            <div
              className="flex flex-col gap-1 w-full"
              style={{ width: "18rem" }}>
              <div
                onClick={() => !expanded && setExpanded(true)}
                className={`line-clamp-${expanded ? "none" : "3"}`}>
                {props.post.caption?.split("\n").map((line) => (
                  <p className="text-sm break-words">{line}</p>
                ))}
              </div>

              <div>
                <div className="flex items-center">
                  <Heart
                    className="h-6"
                    isLiked={isLiked}
                    onClick={() => {
                      fetcher(
                        isLiked ? "DELETE" : "PUT",
                        `/posts/${props.post.id}/likes`
                      );
                      setIsLiked(!isLiked);
                    }}
                  />
                  <Chat
                    className="h-6"
                    onClick={() => props.setCommentingOnPost(props.post)}
                  />
                  <Bullet className="ml-1 mr-2" />
                  <p className="font-semibold text-sm">
                    {autoDatify(new Date(props.post.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
