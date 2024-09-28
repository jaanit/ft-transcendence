import Image from "next/image";
import { addFriend } from "@/app/api/addFriend";
import { acceptFriend } from "@/app/api/acceptFriend";
import { blockFriend } from "@/app/api/blockFriend";
import { unFriend } from "@/app/api/unfriend";
import { unblockFriend } from "@/app/api/unBlock";
import { useFriendType } from "@/app/api/getFriendtype";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function AddFriend({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
      queryClient.invalidateQueries(['Friends']);
    },
  });

  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <button
        onClick={handler}
        className="bg-black hover:bg-cyan-600 p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
        <Image
          src={"/add_user.png"}
          alt="add friend"
          width={20}
          height={20}
          className="mr-2"
        />
        Add Friend
      </button>
    </>
  );
}
function UnFriend({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
      queryClient.invalidateQueries(['Friends']);
    },
  });
  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <button
        onClick={handler}
        className="bg-black hover:bg-cyan-600 p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
        <Image
          src={"/unfriend.png"}
          alt="unfriend"
          width={20}
          height={20}
          className="mr-2"
        />
        UnFriend
      </button>
    </>
  );
}
function Pending({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
      queryClient.invalidateQueries(['Friends']);
    },
  });
  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <button
        onClick={handler}
        className="bg-slate-400 hover:bg-cyan-600 p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
        <Image
          src={"/pending.png"}
          alt="pending request"
          width={20}
          height={20}
          className="mr-2"
        />
        Pending
      </button>
    </>
  );
}
function AccpetFriend({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: acceptFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
      queryClient.invalidateQueries(['Friends']);
    },
  });
  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <button
        onClick={handler}
        className="bg-cyan-700 hover:bg-cyan-400 p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
        <Image
          src={"/accept.png"}
          alt="accept friend"
          width={20}
          height={20}
          className="mr-2"
        />
        Accept Friend
      </button>
    </>
  );
}

export function Unblock({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unblockFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
      queryClient.invalidateQueries(['Friends']);
    },
  });
  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <button
        onClick={handler}
        className="bg-slate-400 hover:bg-cyan-600 p-2  ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs lg:text-xl">
        <Image
          src={"/unblock.png"}
          alt="Unblock Friend"
          width={20}
          height={20}
          className="mr-2"
        />
        Unblock
      </button>
    </>
  );
}

export function Block({ authId }: { authId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: blockFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["FriendshipType"]);
       queryClient.invalidateQueries(['Friends']);
    },
  });
  const handler = () => {
    mutation.mutate(authId);
  };
  return (
    <>
      <div onClick={handler} className="flex items-center">
        <Image
          src={"/block.png"}
          alt="block Friend"
          width={20}
          height={20}
          className="mr-2"
        />
        Block
      </div>
    </>
  );
}

export default function FriendCases({
  FriendshipType,
  authId,
}: {
  FriendshipType: string;
  authId: string;
}) {
  switch (FriendshipType) {
    case "not friend":
      return <AddFriend authId={authId} />;
    case "friend":
      return <UnFriend authId={authId} />;

    case "pending":
      return <Pending authId={authId} />;

    case "waiting":
      return <AccpetFriend authId={authId} />;
    case "blocking":
      return <Unblock authId={authId} />;
  }
}
// function getFriendType(auth_id: any): import("@tanstack/react-query").QueryFunction<unknown, string[]> {
//   throw new Error("Function not implemented.");
// }
