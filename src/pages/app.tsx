import { Post, User } from ".prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@app/fetcher";
import { JWT, JWTPayload } from "@app/jwt";
import { NewPost } from "@components/newpost";
import { prisma } from "@app/prisma";
import { PostElement } from "@components/post";
import { RemoveScrollBar } from "react-remove-scroll-bar";

type AppProps = {
  user: JWTPayload;
  posts: (Post & { likedBy: User[]; comments: Comment[] })[];
};

export default function App(props: AppProps) {
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  return (
    <div className="h-full mx-auto flex flex-col justify-center items-center">
      {isPosting && (
        <div className="fixed z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition ease-in-out duration-150">
          <NewPost
            className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            setIsPosting={setIsPosting}
          />
          <div
            style={{ backdropFilter: "blur(1px) grayscale(0.1)" }}
            className="h-screen w-screen z-40"
            onClick={() => setIsPosting(false)}
          />
          <RemoveScrollBar />
        </div>
      )}
      <h1 className="font-black text-6xl dark:text-white mb-4">
        Hey, {props.user.username}
      </h1>
      <h2 className="font-medium text-2xl">
        Good {new Date().getHours() > 12 ? "afternoon" : "morning"}
      </h2>
      <div>
        <h1>Posts</h1>
        <div className="flex flex-col gap-10">
          {props.posts.map((post) => (
            <PostElement currentUser={props.user} post={post} key={post.id} />
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

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: { comments: true, likedBy: true },
  });

  const diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return { props: { user, posts: diffPosts } };
};
