import {
  banUserFromGroup,
  useGetMembers,
  useGetMemberShip,
  deleteFromGroup,
  unBanUserFromGroup,
  unmuteFromGroup,
  muteFromGroup,
  makeUserAdmin,
} from "@/app/api/chatApi/chatApiFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { io } from "socket.io-client";
import { useAuth } from "./providers/AuthContext";

interface moreProps {
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
}

interface groupUsersProps {
  user: member;
  idG: string;
}

interface member {
  user_id: string;
  type: string;
  banned: boolean;
  muted: Date;
  user: {
    nickname: string;
    picture: string;
  };
}
interface ConversationProps {
  id: string;
}

const iconAdd = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="white"
    fill="white"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
    <path d="M19 16l-2 3h4l-2 3"></path>
    <title>make admin</title>
  </svg>
);

const iconMute = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
    <title>mute</title>
  </svg>
);
const iconUnmute = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16">
    <path
      d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"
      fill="#000000"></path>
    <path
      d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"
      fill="#000000"></path>
    <path
      d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"
      fill="#000000"></path>
    <title>unmute</title>
  </svg>
);

const iconRemove = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="red"
    fill="red"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
    <path d="M22 22l-5 -5"></path>
    <path d="M17 22l5 -5"></path>
    <title>remove from group</title>
  </svg>
);

const unBanIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="20"
    height="20"
    viewBox="0 0 50 50">
    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
    <title>unBan</title>
  </svg>
);

const iconBan = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M5.7 5.7l12.6 12.6"></path>
    <title>Ban</title>
  </svg>
);


const GroupUserManagement: React.FC<groupUsersProps> = ({ user, idG }) => {
  const {chatSocket} =  useAuth();
  // handleBanYser **************
  const queryClient = useQueryClient();
  const deleteUser = useMutation({
    mutationFn: deleteFromGroup,
    onSuccess: () => queryClient.invalidateQueries(["getMembers"]),
  });
  const handleDeleteFromGroup = () => {
    deleteUser.mutate({ userId: user.user_id, group: Number(idG) });
  };

  // handleAddUser **************
  const banUser = useMutation({
    mutationFn: banUserFromGroup,
    onSuccess: () => queryClient.invalidateQueries(["getMembers"]),
  });
  const handleBanToGroup = () => {
    banUser.mutate({ userId: user.user_id, group: Number(idG) });
  };

  const unBanUser = useMutation({
    mutationFn: unBanUserFromGroup,
    onSuccess: () => queryClient.invalidateQueries(["getMembers"]),
  });
  const handleUnBanToGroup = () => {
    unBanUser.mutate({ userId: user.user_id, group: Number(idG) });
  };

  const mute = useMutation({
    mutationFn: muteFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["getMembers"]);
    },
  });
  chatSocket?.emit("sendMessage", { group_id: idG });
  const handleMuteToGroup = () => {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 18);
    mute.mutate({
      userId: user.user_id,
      group: Number(idG),
      date: currentDate,
    });
  };

  const unmute = useMutation({
    mutationFn: unmuteFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["getMembers"]);
    },
  });
  chatSocket?.emit("sendMessage", { group_id: idG });
  const handleUnMuteToGroup = () => {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() - 8);
    mute.mutate({
      userId: user.user_id,
      group: Number(idG),
      date: currentDate,
    });
  };

  const makeAdmin = useMutation({
    mutationFn: makeUserAdmin,
    onSuccess: () => queryClient.invalidateQueries(["getMembers"]),
  });
  const handleMakeAdmin = () => {
    makeAdmin.mutate({ userId: user.user_id, group: Number(idG) });
  };

  // *********** FIN ******************
  return (
    <div className="col-span-2 flex flex-row-reverse justify-between items-center w-[100%] pr-2 ">
      {user.type === "member" && (
        <button
          className="hover:cursor-pointer icon icon-tabler icon-tabler-user-bolt"
          onClick={() => handleMakeAdmin()}>
          {iconAdd}
        </button>
      )}
      <button
        className="hover:cursor-pointer icon icon-tabler icon-tabler-user-x m-2"
        onClick={() => handleDeleteFromGroup()}>
        {iconRemove}
      </button>
      {!user.banned &&
        (user.muted && new Date(user.muted) >= new Date() ? (
          <button
            className="hover:cursor-pointer icon icon-tabler icon-tabler-ban "
            onClick={() => handleUnMuteToGroup()}>
            {iconUnmute}
          </button>
        ) : (
          <button
            className="hover:cursor-pointer icon icon-tabler icon-tabler-ban "
            onClick={() => handleMuteToGroup()}>
            {iconMute}
          </button>
        ))}
      {user.banned ? (
        <button
          className="hover:cursor-pointer icon icon-tabler icon-tabler-ban "
          onClick={() => handleUnBanToGroup()}>
          {unBanIcon}
        </button>
      ) : (
        <button
          className="hover:cursor-pointer icon icon-tabler icon-tabler-ban "
          onClick={() => handleBanToGroup()}>
          {iconBan}
        </button>
      )}
    </div>
  );
};

export const AboutGroup: React.FC<ConversationProps> = ({ id }) => {
  const { data: getMembers, isLoading, isError } = useGetMembers(id);
  const { data: getMembership } = useGetMemberShip(id);
  if (isLoading)
    return (
      <div className="flex justify-content items-center">
        <Spinner />
      </div>
    );
  return (
    <div className=" w-full absolute overflow-auto no-scrollbar bottom-11 top-20 ">
      <span className="text-white text-lg m-3">Members</span>
      <div className="my-2 overflow-y-auto h-[100%] no-scrollbar">
        {getMembers &&
          getMembers.map((user: member, key: number) => {
            return (
              <div
                key={key}
                className={`grid grid-cols-6 p-2 w-full  border-gray-300 hover:bg-black hover:bg-opacity-5   items-center `}>
                <div className=" flex  col-span-1 ">
                  <Link href={`/profile/${user.user?.nickname}`}>
                    {/* src={user.user?.picture!} */}
                    <div className="w-12 h-12">
                      <div
                        className="h-full w-full rounded-full bg-cover"
                        style={{
                          backgroundImage: `url(${user.user?.picture!})`,
                        }}></div>
                    </div>
                  </Link>
                </div>
                <div
                  id="info"
                  className="pt-1 col-span-3 flex items-center text-white text-lg font-mono tracking-normal">
                  {user.user?.nickname}
                </div>
                {((getMembership?.type !== "member" &&
                  user.type === "member") ||
                  (getMembership?.type === "creator" &&
                    user.type !== "creator")) && (
                  <GroupUserManagement user={user} idG={id} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
