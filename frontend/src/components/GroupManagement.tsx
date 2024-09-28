import {
  deleteGroup,
  quitGroup,
  useGetMemberShip,
} from "@/app/api/chatApi/chatApiFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface groupManagementProps {
  userId: string| undefined;
  group: any;
  idG: string;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  friendToGroup: boolean;
  setFriendToGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroupManagement: React.FC<groupManagementProps> = ({
  userId,
  group,
  idG,
  more,
  setMore,
  friendToGroup,
  setFriendToGroup,
}) => {
  const handleExit = () => {
    setMore(false);
    setFriendToGroup(false);
  };
  const route = useRouter();
  const usedeleteGroup = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => route.push("/chat/id"),
  });
  const handleDeleteGroup = () => {
    usedeleteGroup.mutate(Number(idG));
  };

  const quitMutation = useMutation({
    mutationFn: quitGroup,
    onSuccess: () => route.push("/chat/id"),
  });
  const handleQuit = () => {
    quitMutation.mutate({ group: Number(idG) });
  };
  const { data: getMembership } = useGetMemberShip(idG);
  return (
    <div className="flex bottom-0 justify-between items-center absolute w-[100%]">
      {group.type === "group" && (
        <>
          {(getMembership?.type === "creator" ||
            getMembership?.type === "admin") && (
            <div className="flex">
              <button
                onClick={() => setFriendToGroup(!friendToGroup)}
                className="mr-auto ml-2 flex bottom-0  text-gray-300 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-users-plus"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  <path d="M16 19h6"></path>
                  <path d="M19 16v6"></path>
                </svg>
              </button>
            </div>
          )}
          <div className="mx-auto flex  gap-x-2 w-[50%]">
            {getMembership?.type === "creator" && (
              <button
                id="send"
                className="pl-2.5 bg-[#e13636f2] flex justify-center font-mono w-[100%] text-white rounded-3xl shadow-black mb-1 pr-2 py-1"
                onClick={handleDeleteGroup}>
                Delete
              </button>
            )}
            <button
              id="send"
              className="pl-2.5 bg-[#e13636f2] flex justify-center font-mono w-[100%] text-white rounded-3xl shadow-black mb-1 pr-2 py-1"
              onClick={handleQuit}>
              Quit
            </button>
          </div>
        </>
      )}
      <div
        className={`flex ${
          group.type === "duo" ? "w-full flex-row-reverse" : ""
        }`}>
        <button
          onClick={handleExit}
          className="ml-auto mr-2 flex bottom-0 text-gray-300 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-big-right"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path>
            <title>Back</title>
          </svg>
        </button>
      </div>
    </div>
  );
};
