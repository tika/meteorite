import React from "react";
import { IconProps } from "../icons";

export function Bullet({ onClick, className }: IconProps) {
  return (
    <svg
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}>
      <circle cx="2" cy="2" r="2" fill="black" fill-opacity="0.27" />
    </svg>
  );
}
