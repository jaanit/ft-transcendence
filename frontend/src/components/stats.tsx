import Image from "next/image";
import { UserProfile, useAuth } from "./providers/AuthContext";
import { useGetStatsUser } from "@/app/api/getStats";
import Link from "next/link";

function Stats({ profileData }: { profileData: UserProfile }) {
  const { dataUser } = useAuth();
  const { data, isLoading, isError } = useGetStatsUser(profileData.auth_id);
  if (isLoading) return <></>;
  if (isError) return <></>;
  return (
    <div className="bg-black bg-opacity-40 rounded-2xl md:shadow-black shadow-2xl flex flex-col p-4 mx-2 my-3">
      <span className="text-white text-2xl font-mono">Stats</span>
      <div className="flex gap-x-6 my-4">
        <div className="flex flex-col items-center w-2/3">
          <Link href={"/profile/" + profileData?.nickname}>
            <div className="w-20 h-20 flex items-center">
              <div
                className="h-20 w-20 rounded-full bg-cover"
                style={{
                  backgroundImage: `url(${profileData?.picture})`,
                }}></div>
            </div>
          </Link>
          <span className="text-white text-xl">{profileData?.nickname}</span>
        </div>
        <div className="flex flex-col items-center w-3/4">
          <div className="flex text-white text-lg xl:text-2xl font-bold gap-2">
            <span>L : {data.loss}</span>
            <span>|</span>
            <span>W : {data.win}</span>
          </div>
          <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl ">
            <span>{data.opp_goal}</span>
            <span>Goal</span>
            <span>{data.my_goal}</span>
          </div>
          <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl">
            <span>{data.opp_rank}</span>
            <span>Rank</span>
            <span>{data.my_rank}</span>
          </div>
        </div>
        <div className="flex flex-col items-center w-2/3">
          <Link href={"/profile/" + dataUser?.nickname}>
            <div className="w-20 h-20 flex items-center">
              <div
                className="h-20 w-20 rounded-full bg-cover"
                style={{
                  backgroundImage: `url(${dataUser?.picture})`,
                }}></div>
            </div>
          </Link>
          <span className="text-white text-xl">{dataUser?.nickname}</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
