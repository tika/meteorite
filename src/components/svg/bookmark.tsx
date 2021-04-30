import React from "react";
import { IconProps } from "../icons";

export function Bookmark({
  onClick,
  className,
  isSaved,
  color,
}: IconProps & { isSaved?: boolean; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={isSaved ? "currentColor" : color}
      className={className}
      onClick={onClick}>
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  );
}
