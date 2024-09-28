import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UseGetChat, UsegetFriends } from "@/app/api/getFriends";
import Spinner from "@/components/spinner";
import { useAuth } from "./providers/AuthContext";
import { getTime } from "./messages";
import { useQueryClient } from "@tanstack/react-query";

interface duo {
  id: number;
  members: Array<any>;
  messages: Array<any>;
  lastChange: any;
}

// import { usegetUserChat } from '@/app/api/checkAuthentication';
export const Pepoule = () => {
  const { showTrue } = useAuth();
  const route = useRouter();
  const queryClient = useQueryClient();
  const pushId = (id: number) => {
    showTrue();
    route.push(`/chat/` + id);
  };
  const [isClicked, setIsClicked] = useState(false);
  const { data, isError, isLoading } = UseGetChat();
  if (isError) return <div>error</div>;
  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  // return <></>
  return (
    <div className="h-[100%] ">
      <div className="flex   ">
        <h1 className="text-gray-300 ml-6 my-2 text-xl font-mono leading-normal ">
          People
        </h1>
      </div>
      <div className=" overflow-y-auto h-[88%] no-scrollbar ">
        {data.map((group: duo, key: number) => {
          return (
            <div
              key={key}
              className={`grid grid-cols-6 p-2 w-full  border-gray-300 hover:bg-black hover:bg-opacity-5 items-centere ${
                isClicked ? "" : ""
              }`}
              onClick={() => pushId(group.id)}
              style={{ cursor: "pointer" }}>
              <div className=" flex  col-span-1">
                <div className="w-12 h-12">
                  <div
                    className="h-12 w-12 rounded-full bg-cover"
                    style={{
                      backgroundImage: `url(${group.members[0]?.user.picture})`,
                    }}></div>
                </div>
              </div>
              <div
                id="info"
                className=" col-span-5  flex justify-between text-gray-300 ">
                <div className="flex flex-col justify-start">
                  <span className="text-xl font-bold">
                    {group.members[0]?.user.nickname}
                  </span>
                  <div className="text-xs text-gray-400">
                    {" "}
                    {group.messages.length
                      ? group.messages[0].message_text.length > 30
                        ? group.messages[0].message_text.slice(0, 30) + "..."
                        : group.messages[0].message_text
                      : ""}{" "}
                  </div>
                </div>
                {/* <p className='text-xs text-gray-300'>{user.username}</p> */}
                <p className="m-2 text-gray-400 text-var-selver font-roboto text-xs font-light tracking-tighter">
                  {getTime(new Date(group.lastChange))}
                </p>
              </div>
              <div className=" col-span-2 flex flex-row-reverse   items-center w-[100%] pr-2">
                {/* <p className= "bg-orange-700 px-1 text-sm  rounded-3xl  mr-2">12</p> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
