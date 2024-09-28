import Image from "next/image";
import { useAuth } from "./providers/AuthContext";
import { useGetMyRank } from "@/app/api/getRank";

export default function MyRank() {
  const { dataUser } = useAuth();
  const { data: myRank } = useGetMyRank();
  return (
    <div className="h-[98px] bg-black bg-opacity-40 rounded-2xl  flex justify-between p-6 m-2">
      <div className="flex gap-x-4 items-center">
        <div className="w-16 h-16">
          <div
            className="h-16 w-16 rounded-full bg-cover"
            style={{ backgroundImage: `url(${dataUser?.picture})` }}></div>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-2xl">{dataUser?.nickname}</span>
          <span className="text-slate-400 font-medium text-sm">
            {myRank?.user.leaderboard} points
          </span>
        </div>
      </div>
      <div className="flex  items-center">
        <Image
          src={"/gold.svg"}
          alt="Avatar of user"
          width={100}
          height={100}
          className="w-32 h-32"
          priority={true}
        />
        <span className="text-white text-2xl"># {myRank?.rank}</span>
      </div>
    </div>
  );
}
