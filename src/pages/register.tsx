import { GetServerSideProps } from "next";
import { fetcher } from "../app/fetcher";
import { JWT } from "../app/jwt";
import { Form } from "../components/form";
import { Input } from "../components/input";
import { registerSchema } from "../schemas/users";

export default function Register() {
  return (
    <div
      className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center`}
    >
      <h1 className="font-black text-6xl dark:text-white mb-8">Register</h1>
      <Form
        submit={async (body) => {
          await fetcher("PUT", "/users", body);
        }}
        components={{
          username: (p) => (
            <Input type="text" label="Username" p={p} error={p.error} />
          ),
          email: (p) => (
            <Input type="email" label="Email address" p={p} error={p.error} />
          ),
          password: (p) => (
            <Input
              type="password"
              label="Password"
              p={p}
              error={p.error}
              isLast={true}
            />
          ),
        }}
        schema={registerSchema}
        buttonText="Sign up"
      />
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const user = JWT.parseRequest(ctx.req);

//   if (user) {
//     return {
//       redirect: {
//         destination: "/test",
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// };
