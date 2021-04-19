import { SafeUser } from "@components/post";
import { Dots } from "@components/svg/dots";
import React from "react";

interface LeftProps {
    user: SafeUser;
}

export function Left(props: LeftProps) {
    const profilePicture =
        "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

    return (
        <div className="flex justify-center w-full py-8 z-50 col-span-3">
            <div className="fixed flex flex-col">
                <div className="flex flex-row gap-3 items-center">
                    <img
                        src={profilePicture}
                        className="w-16 h-16 max-w-none object-cover rounded-md"
                    />
                    <div className="leading-tight">
                        <h1 className="font-semibold">
                            @{props.user.username}
                        </h1>
                        <h2>Joined 16th October</h2>
                    </div>
                    <Dots
                        className="h-5 ml-2"
                        onClick={() => console.log("profile settings")}
                    />
                </div>
            </div>
        </div>
    );
}
