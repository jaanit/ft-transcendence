"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/navBar";

import Stats from "@/components/stats";
import { Achievement } from "@/components/achievement";
import { useAuth } from "@/components/providers/AuthContext";
import Infos from "@/components/infos";
import RecentGames from "@/components/recentGames";
import { GetUser } from "@/app/api/getUserByNickname";
import { Link } from "lucide-react";
import Friends from "@/components/friends";
import Spinner from "@/components/spinner";

export default function Profile() {
  const params = useParams();
  const { dataUser } = useAuth();
  const {
    data: profileData,
    isError,
    isLoading,
  } = GetUser(params.user.toString());
  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-10 ">
        <Spinner />
      </div>
    );
  if (isError) return <div className="text-2xl">404 Not Found</div>;
  return (
    <div className="h-[1037px] z-0 w-full  relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  shadow-black shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className="h-full flex bg-slate-800  bg-opacity-40 rounded-2xl overflow-y-auto no-scrollbar">
        <NavBar />
        <div className="w-full">
          <div className="w-full p-4 flex justify-center">
            {profileData && <Infos profileData={profileData} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="col-span-2">
              <div className="h-[700px] bg-black bg-opacity-40 rounded-2xl shadow-black shadow-xl p-4 mx-2 my-3 overflow-y-auto no-scrollbar">
                <RecentGames nickname={params.user.toString()} />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex flex-col h-[720px]">
                <div className="h-full bg-black bg-opacity-40 rounded-2xl shadow-black shadow-xl p-4 mx-2 my-3 overflow-y-auto no-scrollbar">
                  <span className="text-white text-2xl font-mono">Friends</span>
                  <Friends auth_id={profileData?.auth_id} />
                </div>
                {dataUser && params.user !== dataUser?.nickname && (
                  <Stats profileData={profileData} />
                )}
                <Achievement nickname={profileData.nickname} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
