import { Post } from ".prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@app/fetcher";
import { JWT, JWTPayload } from "@app/jwt";
import { NewPost } from "@components/newpost";
import { prisma } from "@app/prisma";
import { PostElement } from "@components/post";

type AppProps = {
  user: JWTPayload;
  posts: Post[];
};

export default function App(props: AppProps) {
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center`}
    >
      {isPosting && (
        <>
          <div className="absolute flex justify-center align-center z-30">
            <NewPost setIsPosting={setIsPosting} />
          </div>
          <div
            className="absolute w-screen h-screen z-10"
            onClick={() => setIsPosting(false)}
          />
        </>
      )}
      <h1 className="font-black text-6xl dark:text-white mb-4">
        Hey, {props.user.username}
      </h1>
      <h2 className="font-medium text-2xl">
        Good {new Date().getHours() > 12 ? "afternoon" : "morning"}
      </h2>
      <div>
        <h1>Posts</h1>
        <div className="flex flex-col gap-4 ">
          {props.posts.map((post) => (
            <PostElement post={post} key={post.id} />
          ))}
        </div>
        <p>You have posted {props.posts.length} times</p>
      </div>
      <button onClick={() => setIsPosting(true)}>Create post</button>
      <button
        onClick={() =>
          fetcher("GET", "/logout").then(() => {
            router.push("/");
            toast.success(`Successfully logged out as ${props.user.username}!`);
          })
        }
      >
        Logout
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({ where: { authorId: user.id } });

  return { props: { user, posts } };
};
