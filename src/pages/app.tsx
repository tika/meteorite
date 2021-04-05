import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { fetcher } from "../app/fetcher";
import { JWT, JWTPayload } from "../app/jwt";

type AppProps = {
  user: JWTPayload;
};

export default function App(props: AppProps) {
  const router = useRouter();

  return (
    <div
      className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center`}
    >
      <h1 className="font-black text-6xl dark:text-white mb-4">
        Hey, {props.user.username}
      </h1>
      <h2 className="font-medium text-2xl">
        Good {new Date().getHours() > 12 ? "afternoon" : "morning"}
      </h2>
      <button
        onClick={() => fetcher("GET", "/logout").then(() => router.push("/"))}
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

  return { props: { user } };
};
