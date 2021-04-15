import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@app/fetcher";
import { JWT, JWTPayload } from "@app/jwt";
import { NewPost } from "@components/newpost";
import { prisma } from "@app/prisma";
import { extendedPost, PostElement } from "@components/post";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { Comments } from "@components/comments";

type AppProps = {
  user: JWTPayload;
  posts: extendedPost[];
};

/*
  I needed a commit for today, so here's how it goes;
  I have no clue what to do with this project, as I hate CSS
  Now, while I hate CSS, I don't hate progress, however,
  I can't get any progress done without CSS
  My hate for CSS has expanded out of just "oo it doesn't work"
  Instead it's now "oo it doesn't work and what the hell am i doing 
  with my life, I should be writing GOOD code, not spending all day
  changing the color of something that hasn't even been implemented"

  The design for this project has not been made, neither in my head
  nor in Figma and thus I have left it upon myself to use CSS to somehow
  style and design this project for me, so I don't know anymore - what
  am i supposed to do? Sit here all day trying to make the div center or
  do I watch Breaking Bad for 12 hours straight? I think I'll go with the
  second option. So I apologise future me for not having a very useful commit
  for today, but here it is - I changed absolutely nothing to this code,
  but luckily I'm brainstorming some ideas that I could implement if
  I had a plan for this project and not rely on CSS... 
  (No one should ever rely on CSS)
*/

export default function App(props: AppProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [commentingOnPost, setCommentingOnPost] = useState<extendedPost>();
  const router = useRouter();

  return (
    <div className="h-full w-screen flex flex-col justify-center items-center">
      {isPosting && (
        <div className="fixed z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
      {commentingOnPost && (
        <div className="fixed z-30 left-1/2 bottom-0 transform -translate-x-1/2 transition">
          <Comments
            className="fixed z-50 left-1/2 bottom-0 transform -translate-x-1/2"
            post={commentingOnPost}
          />
          <div
            style={{ backdropFilter: "blur(1px) grayscale(0.1)" }}
            className="h-screen w-screen z-40"
            onClick={() => setCommentingOnPost(undefined)}
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
            <PostElement
              setCommentingOnPost={(p: extendedPost) => setCommentingOnPost(p)}
              currentUser={props.user}
              post={post}
              key={post.id}
            />
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

  let diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return { props: { user, posts: JSON.parse(JSON.stringify(diffPosts)) } };
};
