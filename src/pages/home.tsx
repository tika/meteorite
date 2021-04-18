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

type HomeProps = {
  user: JWTPayload;
  posts: extendedPost[];
};

export default function Home(props: HomeProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [commentingOnPost, setCommentingOnPost] = useState<extendedPost>();
  const router = useRouter();

  return (
    <div
      className="h-full flex flex-col justify-center items-center"
      style={{
        width: "calc(100vw - 17px)",
      }}
    >
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
