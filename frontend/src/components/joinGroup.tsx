import { joinToGroup } from "@/app/api/chatApi/chatApiFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Router from "next/navigation";
import React, { use, useState, useRef, useEffect } from "react";
import { Chat } from "./Groups";
interface Message {
  timestamp: string;
}

interface CreatGroupProps {
  joinId: Chat;
  setJoinId: React.Dispatch<React.SetStateAction<Chat | null>>;
  joinConfirm: boolean;
  setJoinConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JoinGroup: React.FC<CreatGroupProps> = ({
  joinId,
  setJoinId,
  joinConfirm,
  setJoinConfirm,
}) => {
  const [isValid, setIsValid] = useState(false);
  const queryClient = useQueryClient();
  const joinGroupMutution = useMutation({
    mutationFn: joinToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["dataGroups"]);
      setJoinConfirm(true);
    },
    onError: () => {
      setIsValid(checkPasswordIsValid);
    },
  });
  const handleJoninGroup = () => {
    if (joinId.privacy == "protected") {
      joinGroupMutution.mutate({
        group: Number(joinId.id),
        password: joinId.password,
      });
    } else joinGroupMutution.mutate({ group: Number(joinId.id), password: "" });
  };

  const checkPasswordIsValid = () => {
    if (joinId.password === "" || joinId.password?.length < 3) return false;

    return true;
  };
  return (
    <div className="absolute z-50 left-[30%] m-auto opacity-100 right-[30%] top-[30%] bg-black rounded-2xl">
      <button onClick={() => setJoinId(null)} className="m-4">
        <svg
          fill="#ffffff"
          height="16px"
          width="16px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 460.775 460.775"
          xmlSpace="preserve"
          stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>
          </g>
        </svg>
      </button>

      <div className="flex justify-center">
        <header className="items-center">
          <p className="text-center text-2xl text-white font-mono leading-normal">
            Join Group
          </p>
          <p className="text-gray-400 text-xs mt-2 font-mono leading-normal">
            this group protected entre password to join.
          </p>
        </header>
      </div>
      {joinId.privacy === "protected" && (
        <div className="-500 m-6">
          <input
            type="password"
            onChange={(input) =>
              setJoinId({ ...joinId, password: input.target.value })
            }
            name="text"
            className="text-sm w-[78%]  ml-8 px-3 py-3 mt-3 border bg-black border-gray-300 font-mono rounded focus:outline-none text-white"
            pattern="\d+"
            placeholder="Password"></input>
          <p className="text-center text-gray-400 text-xs mt-3 font-mono leading-normal">
            By joining a group you agree to our Terms of Service and Privacy
            Policy
          </p>
        </div>
      )}
      <div className="w-[100%] flex justify-center mt-8 mb-8">
        {checkPasswordIsValid() && (
          <button
            onClick={handleJoninGroup}
            className="flex justify-center items-center p-2 gap-2 h-8 w-32 bg-white rounded-full hover:bg-white focus:outline-none cursor-pointer">
            <span className="text-xl leading-6 text-black font-mono">Join</span>
          </button>
        )}
        {!checkPasswordIsValid() && (
          <button className="flex justify-center items-center p-2 gap-2 h-8 w-32 bg-gray-500 rounded-full  focus:outline-none cursor-not-allowed">
            <span className="text-xl leading-6 text-black font-mono">Join</span>
          </button>
        )}
      </div>
    </div>
  );
};
