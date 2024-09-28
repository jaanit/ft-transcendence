import { seeAllNotification, useGetNotification } from "@/app/api/notification";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/navigation";
import { UseMutationResult, useMutation } from "@tanstack/react-query";

interface notification {
  type: string;
  seen: boolean;
  last_change: Date;
  path: string;
  Source: {
    auth_id: string;
    nickname: string;
    picture: string;
  };
}

export default function Notification({
  setNot,
}: {
  setNot: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: notifications, isSuccess } = useGetNotification();
  const mutation = useMutation({
    mutationFn: seeAllNotification,
  });
  return (
    <div className="flex h-full flex-col w-full overflow-y-auto no-scrollbar">
      <span className="text-lg font-bold flex justify-between">
        Notifications{" "}
        <IoIosClose
          onClick={() => {
            setNot(false);
            mutation.mutate();
          }}
          className="lg:hidden"
          size={32}
        ></IoIosClose>
      </span>
      {notifications?.map((notification: notification, id: number) => (
        <div key={id} className="flex flex-col w-full">
          {notification.type === "challenge" ? (
            <ChallengeNotification
              notification={notification}
              setNot={setNot}
              mutation={mutation}
            />
          ) : (
            <OtherNotification notification={notification} setNot={setNot} mutation={mutation} />
          )}
        </div>
      ))}
    </div>
  );
}

function ChallengeNotification({
  notification,
  setNot,
  mutation,
}: {
  notification: notification;
  setNot: Dispatch<SetStateAction<boolean>>;
  mutation: UseMutationResult<any, unknown, void, unknown>;
}) {
  const { socket } = useAuth();
  const router = useRouter();
  const [msg, setMsg] = useState(notification.path);
  useEffect(() => {
    socket?.on("gameStart", (path: string) => {
      setMsg("waiting...");
      router.push(path);
      setNot(false);
      mutation.mutate();
    });
  }, [socket, mutation, router, setNot]);
  const accept = (challenger: string) => {
    socket?.emit("acceptGame", { challenger });
    setMsg(notification.path);
  };
  const reject = (challenger: string) => {
    socket?.emit("rejectGame", { challenger });
    setMsg(notification.path);
    setMsg("rejected");
  };
  return (
    <div
      className={`flex items-center  gap-x-4 w-full p-4 mt-6 rounded-2xl justify-between ${
        !notification.seen ? "bg-slate-400" : "bg-slate-200"
      }`}
    >
      <div className="flex gap-4">
        <div className="w-14 h-14">
          <div
            className="h-14 w-14 rounded-full bg-cover"
            style={{
              backgroundImage: `url(${notification.Source.picture})`,
            }}
          ></div>
        </div>
        <div className="flex flex-col">
          <span className="text-black-500 text-lg">
            {notification.Source.nickname}
          </span>
          <span className="text-slate-500 text-sm">
            {notification.type + "  " + notification.path}
          </span>
        </div>
      </div>
      {notification.path === "" && (
        <div className="flex gap-4 justify-center">
          <button onClick={() => accept(notification.Source.auth_id)}>
            <svg
              className="w-6 h-6 hover:text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <button onClick={() => reject(notification.Source.auth_id)}>
            <svg
              className="w-6 h-6 hover:text-red-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function OtherNotification({
    notification,
    setNot,
    mutation,
  }: {
    notification: notification;
    setNot: Dispatch<SetStateAction<boolean>>;
    mutation: UseMutationResult<any, unknown, void, unknown>;
  }) {
  return (
    <Link
      href={notification.path}
      onClick={() => {
        setNot(false);
        mutation.mutate();
      }}
      className={`flex items-center  gap-x-4 w-full p-4 mt-6 rounded-2xl justify-between ${
        !notification.seen ? "bg-slate-400" : "bg-slate-200"
      }`}
    >
      <div className="flex gap-4">
        <div className="w-14 h-14">
          <div
            className="h-14 w-14 rounded-full bg-cover"
            style={{
              backgroundImage: `url(${notification.Source.picture})`,
            }}
          ></div>
        </div>
        <div className="flex flex-col">
          <span className="text-black-500 text-lg">
            {notification.Source.nickname}
          </span>
          <span className="text-slate-500 text-sm">{notification.type}</span>
        </div>
      </div>
    </Link>
  );
}
