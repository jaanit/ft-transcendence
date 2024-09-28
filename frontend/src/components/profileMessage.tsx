import { use, useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { MessageInfo } from "./Conversation";
import Image from "next/image";
import { close } from "./toggle";
import NextImage from "next/image";
import Link from "next/link";
import {
  useGetMemberShip,
  UsegetGroups,
} from "@/app/api/chatApi/chatApiFunctions";
import { group } from "console";
import { Chat } from "./Groups";
import { io } from "socket.io-client";
import { Socket } from "dgram";
import { CreatGroup } from "./creatGroup";
import { UpdateChannel } from "./updateChannel";

interface ProfileMessagesProps {
  group: any;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  socket: any;
  // data: MessageInfo[];
  // setData: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
  // dataUser: any;
}

export const ProfileMessages: React.FC<ProfileMessagesProps> = ({
  group,
  more,
  setMore,
  socket,
}) => {
  const [isTyping, setisTyping] = useState<string | null>("");
  const [newGroup, setNewGroup] = useState(false);

  const { showFalse } = useAuth();
  const { data: getMembership } = useGetMemberShip(group.id);
  useEffect(() => {
    socket.on("isTyping", (data: { message: string; id: number }) => {
      if (data.id === Number(group.id)) setisTyping(data.message);
    });
    socket.on("notTyping", () => {
      setisTyping(null);
    });
  }, [group.id, socket]);
  return (
    <div className=" w-full h-1/10 border-b border-gray-300 flex items-center p-1">
      {newGroup && <UpdateChannel group={group} setNewGroup={setNewGroup} />}
      <div className="flex">
        {group.type === "duo" ? (
          <Link href={"/profile/" + group.members[0].user.nickname}>
            <div className="w-12 h-12">
              <div
                className="h-12 w-12 rounded-full bg-cover"
                style={{
                  backgroundImage: `url(${group.members[0].user.picture})`,
                }}
              ></div>
            </div>
          </Link>
        ) : (
          <div className="w-12 h-12">
            <div
              className="h-12 w-12 rounded-full bg-cover"
              style={{ backgroundImage: `url(${group.picture})` }}
            ></div>
          </div>
        )}
      </div>
      <div id="info" className="ml-3">
        <span className="text-white text-lg">
          {group.type === "group" ? group.name : group.members[0].user.nickname}
        </span>
        {isTyping && <p className="text-xs font-mono ">{isTyping}</p>}
      </div>

      <div className="ml-auto mr-0 flex items-center">
        {group.type === "group" && getMembership?.type === "creator" && (
          <button className="mr-3" onClick={() => setNewGroup(true)}>
            <div className="w-6 h-6">
              <div
                className="h-6 w-6 rounded-full bg-cover"
                style={{ backgroundImage: `url(/edit.png)` }}
              ></div>
            </div>
          </button>
        )}
        <button onClick={() => setMore(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300 hover:text-white icon icon-tabler icon-tabler-info-circle"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
            <path d="M12 9h.01"></path>
            <path d="M11 12h1v4h1"></path>
          </svg>
        </button>
      </div>

      <button className="ml-4 flex lg:hidden" onClick={showFalse}>
        {close}
      </button>
    </div>
  );
};
