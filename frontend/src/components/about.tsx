import Image from "next/image";

function About(){
    return (
        <div className="">
            <div className="flex justify-around">
                <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{ backgroundImage: `url(https://cdn.intra.42.fr/users/8294289bee1dcd3e8474a7706f19f3dc/hjabbour.jpg)` }}></div>
                  </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Hossam Jabbouri</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{ backgroundImage: `url(/nhanafi.png)` }}></div>
                  </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Nasreddine Hanafi</span>
                </div>
            </div>
            <div className="flex justify-center">
                 <div className="flex flex-col items-center gap-4">
                 <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{ backgroundImage: `url(/sb3.jpg)` }}></div>
                  </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Reda Jaanit</span>
                </div>
            </div>
            <div className="flex justify-around">
                <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{ backgroundImage: `url(/bmaaqoul.png)` }}></div>
                  </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Brahim Maaqoul</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28">
                    <div
                      className="h-28 w-28 rounded-full bg-cover"
                      style={{ backgroundImage: `url(/ooumlil.jpg)` }}></div>
                  </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Oussama Oumlil</span>
                </div>
            </div>
        </div>
    )
}

export default About;