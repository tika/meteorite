import { Search } from "@components/svg/search";
import React from "react";

export function Right() {
  return (
    <div className="sm:flex justify-center w-full hidden sm:col-span-3 py-8">
      <div className="fixed">
        <div className="relative rounded-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-800" />
          </div>
          <input
            type="text"
            name="email"
            id="email"
            className="focus:ring-indigo-500 py-3 focus:border-indigo-500 block w-72 pl-16 pr-4 sm:text-sm border-gray-300 bg-gray-100 rounded-full"
            placeholder="Search everywhere"
          />
        </div>
      </div>
    </div>
  );
}
