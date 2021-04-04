import { useState } from "react";
import { Moon } from "../components/svg/moon";
import { Sun } from "../components/svg/sun";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen mx-auto flex flex-col justify-center transition duration-200 items-center ${
        darkMode ? "dark bg-black" : ""
      }`}
    >
      <h1 className="font-black text-6xl dark:text-white">Meteorite</h1>
      <h2 className="font-medium text-md mb-16 dark:text-gray-300">
        The cleanest social media webapp ☄
      </h2>
      <button
        type="button"
        className="inline-flex text-white items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-theme-dark hover:bg-theme-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Open App
      </button>
      <div className="absolute left-4 bottom-4">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex gap-1 items-center px-8 py-2 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {darkMode ? <Sun className="h-6" /> : <Moon className="h-6" />}
        </button>
      </div>
    </div>
  );
}
