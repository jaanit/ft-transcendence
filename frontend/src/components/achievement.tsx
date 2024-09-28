import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Stats from "./stats";
import { useGetAchievements, useGetRank } from "@/app/api/getRank";
import Spinner from "./spinner";

export function Achievement({ nickname }: { nickname: string }) {
  const {
    data: achievements,
    isLoading,
    isError,
  } = useGetAchievements(nickname);
  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  if (isError)
    return (
      <div className="h-full flex justify-center items-center text-black text-2xl">
        Error
      </div>
    );

  return (
    <div className="bg-black bg-opacity-40 rounded-2xl shadow-black shadow-2xl flex flex-col p-4 mx-2 my-2">
      <span className="text-white text-2xl font-mono">Achievements</span>
      <Splide
        options={{
          perPage: 2,
          arrows: false,
          pagination: false,
          drag: "free",
          autoWidth: true,
          gap: "2rem",
        }}>
        {achievements.achievement.map(
          (
            achievement: { name: string; description: string },
            index: number
          ) => (
            <SplideSlide key={index} className="p-4">
              <div className="flex flex-col justify-center items-center">
                <div className="w-[85px] h-[120px]">
                  <div
                    className="h-full w-full bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: `url(/${achievement.name}.png)`,
                    }}></div>
                </div>
                <span className="text-white mt-2">
                  {achievement.description}
                </span>
              </div>
            </SplideSlide>
          )
        )}
      </Splide>
    </div>
  );
}
