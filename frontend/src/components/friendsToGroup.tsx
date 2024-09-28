import {
  addFriendToGroup,
  useGetInvited,
} from "@/app/api/chatApi/chatApiFunctions";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { set } from "react-hook-form";

interface friendsToGroupProps {
  setFriendToGroup?: React.Dispatch<React.SetStateAction<boolean>>;
  friendToGroup?: boolean;
  groupName?: string;
  groupPassword?: string;
  groupPrivacy?: string;
  idGroup: string;
  idUser: string;
  FriendToGroup: any;
}

const iconToAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="hover:cursor-pointer icon icon-tabler icon-tabler-user-plus text-gray-400 hover:text-white"
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
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M16 19h6"></path>
    <path d="M19 16v6"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
  </svg>
);

const iconWhenAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-user-check text-green-950"
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
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
    <path d="M15 19l2 2l4 -4"></path>
  </svg>
);

const IconChange: React.FC<friendsToGroupProps> = ({ idUser, idGroup }) => {
  const [friendJoin, setFriendJoin] = useState(true);
  const queryCLient = useQueryClient();
  const addFriendToGroupMutution = useMutation({
    mutationFn: addFriendToGroup,
    onSuccess: () => queryCLient.invalidateQueries(["getInvited"]),
  });
  const handleAddFriendToGroup = (id: number) => {
    addFriendToGroupMutution.mutate({
      group: Number(idGroup),
      userId: idUser,
    });
  };

  return (
    <div
      className=" col-span-2 flex flex-row-reverse items-center w-[100%] pr-2 "
      onClick={() => handleAddFriendToGroup(1)}
    >
      {friendJoin ? iconToAdd : iconWhenAdd}
    </div>
  );
};
export function FriendsToGroup({ idGroup }: { idGroup: string }) {
  const [friendAdded, setFriendAdded] = useState(null);
  const getAddFriendToGroupMutution = useMutation(addFriendToGroup);
  const { data, isLoading } = useGetInvited(idGroup);
  return (
    <div className=" w-full absolute overflow-auto no-scrollbar bottom-11 top-20 ">
      <span className="text-white text-lg m-3">Invite Members</span>
      <div className="my-2 overflow-y-auto h-[100%] no-scrollbar">
        {data &&
          data.map((user: any, key: number) => {
            return (
              <div
                key={key}
                className={`grid grid-cols-6 p-2 w-fullborder-gray-300 hover:bg-black hover:bg-opacity-5 items-center `}
              >
                <div className=" flex  col-span-1 ">
                  <Link href={`/profile/${user?.nickname}`}>
                    <div className="w-12 h-12">
                      <div
                        className="h-full w-full rounded-full bg-cover"
                        style={{ backgroundImage: `url(${user?.picture})` }}
                      ></div>
                    </div>
                  </Link>
                </div>
                <div
                  id="info"
                  className="col-span-3 flex items-center text-lg font-mono tracking-normal"
                >
                  <span style={{ color: "white", marginRight: "10px" }}>
                    {user.nickname}
                  </span>
                </div>
                <IconChange
                  idUser={user.auth_id}
                  idGroup={idGroup}
                  FriendToGroup={undefined}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
