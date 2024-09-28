import {
  UsegetFriends,
  getMemberGroup,
  UsegetGroups,
  banUserFromGroup,
  useGetMembers,
  useGetMemberShip,
} from "@/app/api/chatApi/chatApiFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import { UserProfile, useAuth } from "./providers/AuthContext";
import { AnyARecord } from "dns";
import FriendCases, { Block, Unblock } from "./friendStatus";
import { GetUser } from "@/app/api/getUserByNickname";
import { useFriendType } from "@/app/api/getFriendtype";
import { blockFriend } from "@/app/api/blockFriend";
import Image from "next/image";
import { unblockFriend } from "@/app/api/unBlock";
import Challenge from "./challengeButton";

interface ConversationProps {
  id: string;
  group: any;
}

export const AboutDuo: React.FC<ConversationProps> = ({ group }) => {
  const { data: FriendshipType } = useFriendType(group.members[0].user_id);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: blockFriend,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "FriendshipType",
        group.members[0].user_id,
      ]);
    },
  });
  const mutation1 = useMutation({
    mutationFn: unblockFriend,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "FriendshipType",
        group.members[0].user_id,
      ]);
    },
  });
  const handler = () => {
    mutation.mutate(group.members[0].user_id);
  };
  const handler1 = () => {
    mutation1.mutate(group.members[0].user_id);
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleChallenge = (e: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as HTMLDivElement)
    ) {
      setShowModal(false);
    }
  };
  const handleButtonClick = (e: any) => {
    e.preventDefault();
    setShowModal(true);
  };
  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleChallenge as unknown as (event: Event) => void
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleChallenge as unknown as (event: Event) => void
      );
    };
  }, []);
  return (
    <div className=" w-full absolute overflow-auto bottom-11 top-20 ">
      <div className=" overflow-y-auto h-[100%] no-scrollbar">
        <div className="w-full">
          {FriendshipType?.type === "blocking" ? (
            <div
              onClick={handler1}
              className=" bg-slate-400 hover:bg-cyan-600 hover:cursor-pointer p-2   rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
              <Image
                src={"/unblock.png"}
                alt="Unblock Friend"
                width={20}
                height={20}
                className="mr-2"
              />
              Unblock
            </div>
          ) : (
            //still a bug here
            <div className="flex flex-col gap-y-2">
              <div
                className=" bg-red-600 text-white p-2 rounded-2xl hover:cursor-pointer  relative flex justify-center items-center px-5 text-xs lg:text-xl"
                onClick={handler}>
                <Image
                  src={"/block.png"}
                  alt="block Friend"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Block
              </div>

              <button
                onClick={handleButtonClick}
                className="p-2 flex items-center justify-center bg-black text-white rounded-full">
                <Image
                  src={"/challenge.png"}
                  alt="challenge Friend"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Challenge
              </button>
            </div>
          )}
          {showModal && (
            <div
              ref={modalRef}
              className={`modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[688px] z-50`}>
              <div className="w-full h-full flex flex-col items-center gap-[30px] rounded-[10px] p-[30px] bg-slate-950/70 backdrop-blur-xl">
                <Challenge player={group.members[0].user.auth_id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
