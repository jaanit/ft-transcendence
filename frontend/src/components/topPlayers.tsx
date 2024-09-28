"use client";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { rankInterface, useGetRank } from "@/app/api/getRank";


export default function TopPlayers() {
  const { data: Rank, isLoading, isError } = useGetRank();
  if(isLoading || isError)
    return <></>
  return (
    <div className="h-[250px] my-4 p-4  bg-slate-400 bg-opacity-20 rounded-2xl">
      <span className="text-white text-2xl font-mono px-4">Top Players</span>
      <div className="mt-2 ">
        <Splide
          options={{
            perPage: 9,
            arrows: false,
            pagination: false,
            drag: "free",
            autoWidth: true,
            gap: "1rem",
          }}>
          {Rank.map((user: rankInterface, index: number) => (
            <SplideSlide
              key={index}
              className="flex flex-col justify-center items-center p-4 m-4">
              <Link href={"/profile/" + user.user.nickname} className="w-28">
              <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{
                        backgroundImage: `url(${user.user.picture})`,
                      }}></div>
                  </div>
              </Link>
              <span className="text-white text-lg">{user.user.nickname}</span>
              <span className="text-slate-900 w-24">
                {user.leaderboard + " points"}
              </span>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
