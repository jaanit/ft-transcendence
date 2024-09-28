import { GameData } from "@/app/api/getGame";
import { useAuth } from "./providers/AuthContext";

function FoundMatch({ dataGame }: { dataGame: GameData }) {
  const { dataUser } = useAuth();
  const textShadow = `0px 0px 5px black, 0px 0px 10px white, 0px 0px 20px white, 0px 0px 40px white`;
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-600/60 backdrop-blur max-w-[1000px] h-1/2 w-full sm:w-3/5 z-50 rounded flex flex-col justify-center items-center gap-4 px-4">
      <div
        className="w-full h-1/4 text-center text-white text-5xl pt-4"
        style={{ textShadow: textShadow }}
      >
        Game Over
      </div>
      <div
        className="w-full h-1/4 text-center text-white text-3xl"
        style={{ textShadow: textShadow }}
      >
        {dataGame.status === "uncompleted" ? "uncompleted" : dataGame.winner === dataUser?.auth_id ? "You Win" : "You're a Loser"}
      </div>
      <div className="w-full h-1/2 flex justify-evenly items-center pb-4">
        <div className="flex justify-center items-center mx-4">
          <div className="flex flex-col items-center justify-center gap-2 text-xl text-white">
            <div
              className="h-32 w-32 rounded-full bg-cover"
              style={{
                backgroundImage: `url('${
                  dataGame.user1 ? dataGame.user1.picture : "/nasr.png"
                }')`,
              }}
            ></div>
            <div>{dataGame.user1.nickname}</div>
            <div>{dataGame.score1}</div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className=" text-4xl text-white text-center">VS</div>
        </div>
        <div className="flex justify-center items-center mx-4">
          <div className="flex flex-col items-center justify-center gap-2 text-xl text-white">
            <div
              className="h-32 w-32 rounded-full bg-cover"
              style={{
                backgroundImage: `url('${
                  dataGame.user2 ? dataGame.user2.picture : "/nasr.png"
                }')`,
              }}
            ></div>
            <div>{dataGame.user2 ? dataGame.user2.nickname : "BOT"}</div>
            <div>{dataGame.score2}</div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default FoundMatch;
