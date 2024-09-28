"use client";
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import { Body } from "./component2d/body";
import { Body3D } from "./component3d/body";
import { Game } from "./types/index";

// import { Game } from './types/index';
import { useEffect, useState, useRef, use } from "react";
const game: Game = new Game();

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import NavBar from "@/components/navBar";
import { useAuth } from "@/components/providers/AuthContext";
import { url } from "inspector";
import Link from "next/link";
import { useGetGame } from "@/app/api/getGame";
import FoundMatch from "@/components/foundMatch";
import Score from "@/components/score";
import { useQueryClient } from "@tanstack/react-query";
// import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
// import * as THREE from "three"
// import { Fisheye, CameraControls, PerspectiveCamera, Environment } from '@react-three/drei'

export default function Game2d({
  params,
}: {
  params: { type: string; gameId: string };
}) {
  const queryClient = useQueryClient();
  const { dataUser, socket } = useAuth();
  const {
    data: gameData,
    isLoading,
    isError,
  } = useGetGame(params.type, params.gameId);
  useEffect(() => {
	socket?.on("gameEnd", () => {
	queryClient.invalidateQueries(["gameData", params.type, params.gameId]);
	});
  }, [socket, params, queryClient]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="h-[767px]  z-0 w-full md:w-[83%]  relative md:p-2 md:rounded-3xl md:bg-slate-500 md:bg-opacity-40  md:shadow-black md:shadow-2xl overflow-y-auto no-scrollbar ">
      <div className="flex h-full w-full ">
        <NavBar></NavBar>
        {gameData.status === "finished" || gameData.status === "uncompleted" ? (
          <FoundMatch dataGame={gameData} />
        ) : (
          dataUser &&
          (gameData.dimension === "3D" ? (
            <Body3D
              dataUser={dataUser}
              dataGame={gameData}
              type={params.type}
            />
          ) : (
            // <div className="flex flex-col items-center justify-between m-3">
            //   <Score dataUser={dataUser} />
            <Body dataUser={dataUser} dataGame={gameData} type={params.type} />
            // </div>
          ))
        )}
      </div>
    </div>
  );
}
