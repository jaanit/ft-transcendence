import  Link  from "next/link";
import { UserProfile } from "./providers/AuthContext";

export default function Score({dataUser} : {dataUser: UserProfile}){
	return(
		<div className=" bg-cyan-400 bg-opacity-20 p-4  flex justify-evenly w-[80%] rounded-3xl">
            <div className="flex items-center gap-x-8">
              <span className="text-2xl text-white">{dataUser?.nickname}</span>
              <Link href={""} className="w-16 h-16">
                <div
                  className="w-full h-full rounded-full bg-cover"
                  style={{
                    backgroundImage: `url(${dataUser?.picture})`,
                  }}></div>
              </Link>
              <span className="text-2xl text-white">0</span>
            </div>
            <div className="flex items-center gap-x-8">
              <span className="text-2xl text-white">0</span>
              <Link href={""} className="w-16 h-16">
                <div
                  className="w-full h-full rounded-full bg-cover"
                  style={{
                    backgroundImage: `url(${dataUser?.picture})`,
                  }}></div>
              </Link>
              <span className="text-2xl text-white">{dataUser?.nickname}</span>
            </div>
          </div>
	)
}