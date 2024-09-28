"use client";

import Spline from "@splinetool/react-spline";
import Link from "next/link";
import Toggle from "./toggle";
import styles from "../app/styles.module.css";
import Image from "next/image";
import { UserProfile, useAuth } from "@/components/providers/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useSearchByName } from "@/app/api/getSearchbyName";
import PlayButton from "./playButton";

export default function MainGroup() {
  const { isAuthenticated } = useAuth();
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const { data: getUsersbyname } = useSearchByName(searchText);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchText(query);
    setShowSuggestions(true);
    setSuggestions(getUsersbyname);
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const PingPong = (
    <svg
      className="w-[80%] lg:w-[55%] md:w-[65%]"
      // width="630"
      // height="80"
      viewBox="0 0 630 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 80V20H60V30H70V50H60V60H20V80H0ZM20 50H50V30H20V50ZM110 10V0H130V10H110ZM90 70V60H110V30H100V20H130V60H150V70H90ZM160 70V20H220V30H230V70H210V30H180V70H160ZM250 80V70H290V60H250V50H240V30H250V20H310V70H300V80H250ZM260 50H290V30H260V50ZM320 80V20H380V30H390V50H380V60H340V80H320ZM340 50H370V30H340V50ZM410 70V60H400V30H410V20H460V30H470V60H460V70H410ZM420 60H450V30H420V60ZM480 70V20H540V30H550V70H530V30H500V70H480ZM570 80V70H610V60H570V50H560V30H570V20H630V70H620V80H570ZM580 50H610V30H580V50Z"
        fill="white"
      />
    </svg>
  );
  const description =
    "Experience the timeless thrill of table tennis in our online classic ping pong game! Step into the virtual arena and challenge opponents from around the world to a fast-paced and skillful showdown. With intuitive controls and realistic physics, you'll feel like you're playing the real thing.";

  return (
    <div className="flex flex-col p-4 md:px-8 h-full">
      <div className="  p-2 md:p-3 md:mt-6   md:mx-auto pt-6  w-full flex justify-between items-center ">
        <Toggle />
        <div className=" w-[210px] flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Browse Profiles"
              className="pl-4 h-8 w-full rounded-xl opacity-10 placeholder-slate-800 ml-4 border-black border-2"
              value={searchText}
              onChange={handleSearch}
            />
            {showSuggestions && getUsersbyname && getUsersbyname.length > 0 && (
              <div
                ref={suggestionsRef}
                className=" bg-white  mt-1  ml-4 rounded-xl shadow-black w-full absolute z-50"
              >
                {getUsersbyname.map(
                  (user: UserProfile, index: number) =>
                    searchText && (
                      <Link
                        href={"/profile/" + user?.nickname }
                        key={index}
                        className="  w-full h-full"
                      >
                        <div className="flex hover:bg-slate-200 hover:rounded-xl">
                          <div className="flex gap-x-4 items-center mx-3 py-3">
                            <div className="w-14 h-14 flex items-center">
                              <div
                                className="h-14 w-14 rounded-full bg-cover"
                                style={{
                                  backgroundImage: `url(${user?.picture})`,
                                }}
                              ></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="flex items-center break-words">
                                {user?.displayname}
                              </span>
                              <span className="flex text-sm text-slate-500">
                                @{user.nickname}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <span className=" mt-8">{PingPong}</span>
      <div className="  mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-2 md:mt-12 text-white text-left font-light text-lg lg:text-3xl sm:text-2xl">
          {description}
        </div>
        <div className="relative p-2 mt-12 lg:mt-8">
          <span className="absolute z-20 text-white text-sm sm:text-lg md:text-xl font-mono mx-1 sm:mx-4 lg:mx-8">
            Ping Pong
          </span>
          <div
            className={` ${styles.notch} w-full h-12 mt-6 flex items-center justify-end`}
          >
            <span
              className="h-4 w-4 mx-2  rounded-full text-6xl "
              style={{ backgroundColor: "#F495D9" }}
            ></span>
            <span
              className="h-4 w-4 mx-2 rounded-full text-6xl"
              style={{ backgroundColor: "#D9D9D9" }}
            ></span>

            <span
              className="h-4 w-4 mx-2 rounded-full text-6xl "
              style={{ backgroundColor: "#95F4C6" }}
            ></span>
          </div>
          <div className="w-full h-[200px] sm:h-[300px] border-2 grid grid-cols-2 relative">
            <div className="p-4 border-r-8 border-dashed">
              <span className="absolute h-16 border-2"></span>
              <span
                className="absolute h-2 w-2 m-24 rounded-full text-6xl "
                style={{ backgroundColor: "#fff" }}
              ></span>
            </div>
            <div className="p-4 flex justify-end items-end">
              <span className="absolute h-16 border-2"></span>
            </div>
          </div>
        </div>

        <PlayButton isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
