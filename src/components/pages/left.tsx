import { SafeUser } from "@components/post";
import { Dots } from "@components/svg/dots";
import { Home } from "@components/svg/home";
import React from "react";
import { Bell } from "../svg/bell";
import { Mail } from "../svg/mail";
import { Profile } from "../svg/profile";
import { Bookmark } from "../svg/bookmark";
import { useRouter } from "next/dist/client/router";

interface LeftProps {
  user: SafeUser;
  onPost(): void;
}

export function Left(props: LeftProps) {
  const router = useRouter();

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  return (
    <div className="sm:flex h-screen relative justify-center w-full z-40 hidden sm:col-span-3">
      <div className="fixed flex flex-col h-full items-center justify-between py-8">
        <div>
          <div className="flex flex-row gap-3 items-center">
            <img
              src={profilePicture}
              className="w-16 h-16 max-w-none object-cover rounded-md"
            />
            <div className="leading-tight">
              <h1 className="font-semibold">@{props.user.username}</h1>
              <h2>Joined 16th October</h2>
            </div>
            <Dots
              className="h-5 ml-2"
              onClick={() => console.log("profile settings")}
            />
          </div>
          <div className="flex flex-col w-5/6 mt-16">
            <div
              onClick={() => router.push("/home")}
              className="flex flex-row gap-2 items-center hover:bg-black hover:bg-opacity-10 transition duration-200 rounded-full px-3 py-2 cursor-pointer">
              <Home className="w-6" />
              <h1 className="font-semibold text-lg">Home</h1>
            </div>
            <div className="flex flex-row gap-2 items-center hover:bg-black hover:bg-opacity-10 transition duration-200 rounded-full px-3 py-2 cursor-pointer">
              <Bell className="w-6" />
              <h1 className="font-semibold text-lg">Notifications</h1>
            </div>
            <div className="flex flex-row gap-2 items-center hover:bg-black hover:bg-opacity-10 transition duration-200 rounded-full px-3 py-2 cursor-pointer">
              <Mail className="w-6" />
              <h1 className="font-semibold text-lg">Messages</h1>
            </div>
            <div className="flex flex-row gap-2 items-center hover:bg-black hover:bg-opacity-10 transition duration-200 rounded-full px-3 py-2 cursor-pointer">
              <Profile className="w-6" />
              <h1 className="font-semibold text-lg">Profile</h1>
            </div>
            <div
              onClick={() => router.push("/saved")}
              className="flex flex-row gap-2 items-center hover:bg-black hover:bg-opacity-10 transition duration-200 rounded-full px-3 py-2 cursor-pointer">
              <Bookmark className="w-6" />
              <h1 className="font-semibold text-lg">Saved</h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => props.onPost()}
          className="justify-center w-4/6 text-white items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-s bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Post
        </button>
      </div>
    </div>
  );
}
