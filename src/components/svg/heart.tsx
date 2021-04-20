import React from "react";
import { IconProps } from "../icons";

export function Heart({
  onClick,
  className,
  isLiked,
}: IconProps & { isLiked: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isLiked ? "#EF4444" : "black"}
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}>
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      />
    </svg>
  );
}
