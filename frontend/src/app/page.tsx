"use client";
import NavBar from "@/components/navBar";
import TopPlayers from "@/components/topPlayers";
import MainGroup from "@/components/mainGroup";
import { useAuth } from "@/components/providers/AuthContext";
export default function GamePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="z-0 w-full  relative  p-2 md:rounded-3xl bg-opacity-30  shadow-black shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className="flex flex-col">
        <div className="flex h-full bg-slate-800  bg-opacity-40 rounded-2xl">
          <NavBar />
          <MainGroup />
        </div>
        {isAuthenticated && <TopPlayers />}
      </div>
    </div>
  );
}
