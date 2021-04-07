import { Post, User } from ".prisma/client";
import React from "react";
import { prisma } from "@app/prisma";
import useSWR from "swr";
import { fetcher } from "@app/fetcher";
import ClipLoader from "react-spinners/ClipLoader";

interface PostProps {
  post: Post;
  key: string;
}

export function PostElement(props: PostProps) {
  const { data, error } = useSWR<Omit<User, "password" | "email">>(
    `/users?id=${props.post.authorId}`,
    (url) => fetcher("GET", url)
  );

  return (
    <>
      {!data ? (
        <ClipLoader loading={!data} size={150} />
      ) : (
        <div key={props.key}>
          <img
            className="w-64 h-32"
            src="https://images.ctfassets.net/hrltx12pl8hq/45tAKd349x1JHCRX7MGm6A/8cddb0b45a440fbffbb1d56f3c7d2440/02-nature_1529923664.jpg?fit=fill&w=480&h=270"
          />
          <div className="flex flex-row">
            <img
              className="w-8 h-8"
              src="https://www.turing.ac.uk/sites/default/files/inline-images/placeholder_1.jpg"
            />
            <h1>{data.username}</h1>
          </div>
          {props.post.caption?.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </>
  );
}
