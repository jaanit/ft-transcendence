import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UsegetFriends } from "@/app/api/getFriends";
import { UserProfile, useAuth } from "./providers/AuthContext";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDuo } from "@/app/api/chatApi/chatApiFunctions";
import Challenge from "./challengeButton";

function FriendButton({ element }: { element: UserProfile }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDuo,
    onSuccess: () => queryClient.invalidateQueries(["Friends"]),
  });
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
  const PlayClick = (e: any) => {
    e.preventDefault();
    setShowModal(true);
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      router.push("/chat/" + mutation.data?.id);
    }
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
  }, [mutation.isSuccess, mutation.data?.id, router]);
  return (
    <div className="flex justify-around">
      <button
        onClick={PlayClick}
        className="bg-black hover:bg-cyan-600 text-white p-2 ml-4 rounded-2xl   relative flex justify-center items-center px-5 text-xs md:text-sm xl:text-lg "
      >
        Play Now
      </button>
      <button
        onClick={() => {
          mutation.mutate(element?.auth_id);
        }}
        className="bg-black hover:bg-cyan-600 text-white p-2 ml-4 rounded-2xl relative flex justify-center items-center px-5 text-xs md.text-sm xl:text-lg"
      >
        Message
      </button>
      {showModal && (
        <div
          ref={modalRef}
          className={`modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[688px] z-50`}
        >
          <div className="w-full h-full flex flex-col items-center gap-[30px] rounded-[10px] p-[30px] bg-slate-950/70 backdrop-blur-xl">
            <Challenge player={element.auth_id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Friends({ auth_id }: { auth_id: string }) {
  const { data, isLoading, isError } = UsegetFriends(auth_id);
  const { dataUser } = useAuth();

  if (isLoading) return <Spinner />;

  if (isError || !data) return <>You have no friends like Davies</>;

  return (
    <>
      {!isLoading &&
        data.map((element: UserProfile, index: number) => (
          <div key={index} className="flex justify-between px-4 mx-2 mt-6">
            <Link href={"/profile/" + element?.nickname}>
              <div className="flex gap-x-4 items-center">
                <div className="w-16 h-16 flex items-center">
                  <div
                    className="h-16 w-16 rounded-full bg-cover"
                    style={{
                      backgroundImage: `url(${element.picture})`,
                    }}
                  ></div>
                </div>
                <span className="text-sm xl:text-2xl text-white">
                  {element?.nickname}
                </span>
              </div>
            </Link>

            {dataUser?.auth_id !== element?.auth_id && (
              <FriendButton element={element} />
            )}
          </div>
        ))}
    </>
  );
}
