import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { fetcher } from "@app/fetcher";
import { JWT } from "@app/jwt";
import { Form } from "@components/form";
import { FormInput } from "@components/forminput";
import { loginSchema } from "@schemas/users";

export default function Login() {
    const router = useRouter();

    return (
        <div
            className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center`}>
            <h1 className="font-black text-6xl dark:text-white mb-8">Login</h1>
            <Form
                submit={(body) =>
                    fetcher("POST", "/users", body).then(() =>
                        router.push("/app")
                    )
                }
                components={{
                    username: (p) => (
                        <FormInput
                            type="text"
                            label="Username"
                            p={p}
                            error={p.error}
                        />
                    ),
                    password: (p) => (
                        <FormInput
                            type="password"
                            label="Password"
                            p={p}
                            error={p.error}
                            isLast={true}
                        />
                    ),
                }}
                schema={loginSchema}
                buttonText="Login"
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const user = JWT.parseRequest(ctx.req);

    if (user) {
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };
    }

    return { props: {} };
};
