"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sky,
  PointerLockControls,
  Text,
  Trail,
  OrbitControls,
  Environment,
  Stars,
  RoundedBox,
  useTexture,
  useEnvironment,
  ContactShadows,
  useProgress,
  Html,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Ground } from "./ground";
import * as THREE from "three";
import { Suspense, use, useContext, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import io, { Socket } from "socket.io-client";
import { Game, GameConfig } from "../types/index";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Ball, PSize, key } from "../types/component";
import { UserProfile, useAuth } from "@/components/providers/AuthContext";
import { GameData } from "@/app/api/getGame";
const gameState: Game = new Game();
const physic: Game = new Game();
const keys: key = {
  left: false,
  right: false,
  rotate_pos: false,
  rotate_neg: false,
  start: false,
};

function defaultGame(player: number): GameConfig {
  return {
    player: player,
    bricks: [],
    ball: [],
    paddle1: {
      position: { x: 40, y: 250 },
      width: 30,
      height: 150,
      rotation: 0,
      color: "white",
      scale: 1,
    },
    paddle2: {
      position: { x: 970, y: 250 },
      width: 30,
      height: 150,
      rotation: 0,
      color: "white",
      scale: 1,
    },
    score: { p1: 0, p2: 0 },
    sec: -1,
  };
}

export function Body3D({
  dataUser,
  dataGame,
  type,
}: {
  dataUser: UserProfile;
  dataGame: GameData;
  type: string;
}) {
  const { socket } = useAuth();

  const [gameData, setGameData] = useState(
    dataGame.user1_id === dataUser.auth_id ? defaultGame(0) : defaultGame(1)
  );
  const player = dataGame.user1_id === dataUser.auth_id ? 0 : 1;
  useEffect(() => {
    const handelKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        socket?.emit("gameReady", {
          gameId: dataGame.gameId | dataGame.botGameId,
          type: type,
        });
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        if (player === 0) keys.left = true;
        else keys.right = true;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        if (player === 0) keys.right = true;
        else keys.left = true;
      }
      if (event.key === "x" || event.key === "X") {
        keys.rotate_pos = true;
      }
      if (event.key === "c" || event.key === "C") {
        keys.rotate_neg = true;
      }
    };
    const handelKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        if (player === 0) keys.left = false;
        else keys.right = false;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        if (player === 0) keys.right = false;
        else keys.left = false;
      }
      if (event.key === "x" || event.key === "X") {
        keys.rotate_pos = false;
      }
      if (event.key === "c" || event.key === "C") {
        keys.rotate_neg = false;
      }
    };
    const interval = setInterval(() => {
      socket?.emit("keyGameUpdate", {
        keys: keys,
        gameId: dataGame.gameId | dataGame.botGameId,
        type: type,
      });
    }, 10); //5

    socket?.on("gameUpdate", (data) => {
      setGameData(data);
      gameData.player = data.player;
      if (data.status === "finished") {
        clearInterval(interval);
        socket.off("gameUpdate");
      }
    });

    // socker?.on('gameEnd', (data) => {
    // 	;
    // })

    document.addEventListener("keydown", handelKeyDown);
    document.addEventListener("keyup", handelKeyUp);
    return () => {
      document.removeEventListener("keydown", handelKeyDown);
      document.removeEventListener("keyup", handelKeyUp);
      clearInterval(interval);
      socket?.off("gameUpdate");
    };
  }, [gameData, socket, dataGame, player, type]);
  if (!socket) return <></>;

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 60,
          far: 7000,
          position: [player === 0 ? -1200 : 1200, 200, 0],
        }}
        flat
        linear
      >
        <Suspense
          fallback={
            <Loader
              socket={socket}
              gameId={dataGame.gameId | dataGame.botGameId}
              type={type}
            />
          }
        >
          <ambientLight intensity={1} />
          <Environment files={`/game/${dataGame.map}.hdr`} background={true} />
          <OrbitControls target={[0, -200, 0]} />
          {/* <Sky sunPosition={[1000, 1000, 1000]} /> */}
          <pointLight castShadow intensity={1} position={[1000, 1000, 1000]} />
          <Physics gravity={[0, 0, 0]}>
            <Ground />
            <Paddle paddle={gameData.paddle1} />
            <Paddle paddle={gameData.paddle2} />

            {gameData.ball.map((b, id) => {
              return <Electron key={id} ball={b} />;
            })}

            {gameData.bricks.map((b, id) => {
              return <Brick key={id} brick={b} />;
            })}
            <Wall y={300} />
            <Wall y={-300} />
            <Text
              position={[0, 100, 0]}
              rotation-y={((player * 2 - 1) * Math.PI) / 2}
              scale={[100, 100, 100]}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {gameData.sec >= 0
                ? 3 - gameData.sec
                : gameData.score.p1 + " - " + gameData.score.p2}
            </Text>
            <EffectComposer>
              <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
            </EffectComposer>
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

function Loader({
  socket,
  gameId,
  type,
}: {
  socket: Socket;
  gameId: number;
  type: string;
}) {
  const { progress } = useProgress();
  if (progress !== 0) {
    // socket.emit("gameReady" , {gameId: gameId, type: type});
  }
  return (
    <Html center>
      <div className="relative">
        <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
      </div>
    </Html>
  );
}

interface ElectronProps {
  ball: PSize;
}

function Electron({ ball }: ElectronProps) {
  const ref = useRef<any>();
  const { x, y } = ball.position;
  useFrame((state) => {
    if (ref.current && ref.current.position)
      ref.current.position.set(x - 500, -150, y - 300);
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[ball.width]} />
        <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
      </mesh>
    </group>
  );
}

// function Plan() {

//   return (
//     <>
//       <RigidBody colliders="cuboid" type="fixed"  position={[0,-26,50]}>
//         <mesh>
//         <boxGeometry args={[60, 20, 100]} />
//         <meshStandardMaterial color="red" />
//         </mesh>
//       </RigidBody>
//     </>
//   )
// }
// function Ball({ball}) {

//   return (
//     <>
//       <RigidBody colliders="cuboid" type="fixed" restitution={2.1} position={[ball.position.y - 30,-15,ball.position.x]}>
//         <mesh>
//           <sphereGeometry args={[ball.height, 50, 50]} />
//           <meshStandardMaterial />
//         </mesh>
//       </RigidBody>
//     </>
//   )
// }

function Paddle({ paddle }: { paddle: PSize }) {
  const ref = useRef<any>(null);
  const { x, y } = paddle.position;
  useFrame((state) => {
    ref.current?.position.set(x - 500, -150, y - 300);
  });
  return (
    <RigidBody>
      <mesh ref={ref} position={[x - 500, -150, y - 300]}>
        <RoundedBox
          args={[paddle.width, paddle.width, paddle.height]}
          radius={paddle.width / 2}
          rotation-y={-paddle.rotation}
        >
          {/* <meshPhysicalMaterial map={texture} bumpMap={bump} /> */}
          <meshBasicMaterial color={[1, 10, 8]} toneMapped={false} />
        </RoundedBox>
      </mesh>
    </RigidBody>
  );
}

function Brick({ brick }: { brick: PSize }) {
  const ref = useRef<any>();
  const { x, y } = brick.position;
  useFrame((state) => {
    ref.current.position.set(x - 500, -150, y - 300);
  });
  return (
    <RigidBody>
      <mesh ref={ref}>
        <RoundedBox args={[brick.width, brick.width, brick.height]}>
          <meshPhysicalMaterial
            color={brick.color}
            clearcoat={1}
            clearcoatRoughness={0.5}
            roughness={0.5}
            metalness={0.3}
          />
        </RoundedBox>
      </mesh>
    </RigidBody>
  );
}

function Wall({ y }: { y: number }) {
  return (
    <mesh position={[0, -180, y]}>
      <boxGeometry args={[998, 100, 10]} />
      <meshStandardMaterial
        roughness={1}
        transparent
        opacity={0.6}
        color={"aquamarine"}
      />
    </mesh>
  );
}
