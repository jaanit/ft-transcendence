import { useEffect, useRef, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/navigation";

interface DropDownArrowProps {
  isOpen: boolean;
}

function DropDownArrow({ isOpen }: DropDownArrowProps) {
  return (
    <svg
      className={`w-2.5 h-2.5 ${isOpen ? "" : "-rotate-90"}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 10">
      <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
    </svg>
  );
}

interface DropDownValueProps {
  isOpen: boolean;
  isVertical: boolean;
  array: string[];
  id: string;
  click: (value: string) => void;
}

function DropDownValue({
  isOpen,
  isVertical,
  array,
  id,
  click,
}: DropDownValueProps) {
  return (
    <div
      id={id}
      className={`z-10 bg-white w-full ${
        isOpen ? "block" : "hidden"
      } relative`}>
      <ul
        className={`absolute w-full bg-slate-950/70 ${
          isVertical ? "flex flex-col" : "grid grid-cols-3"
        } justify-center`}>
        {array.map((value, index) => (
          <li
            className="text-white px-5 py-2.5 hover:cursor-pointer hover:animate-pulse"
            key={index}
            onClick={() => click(value)}>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

const textShadow = `0px 0px 5px black, 0px 0px 20px white, 0px 0px 40px white, 0px 0px 80px white`;

const blueBoxShadow = `0px 0px 5px #008000, 0px 0px 20px #008000, 0px 0px 40px #008000`;

const redBoxShadow = `0px 0px 5px #FF0000, 0px 0px 20px #FF0000, 0px 0px 40px #FF0000`;

const DoubleSword = () => {
  return (
    <div className="bg-slate-900/40 rounded-[10px] flex-shrink-0 w-12 h-12 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        style={{ filter: "drop-shadow(2px 2px 4px rgba(38, 99, 235, 0.8))" }}>
        <g
          fill="none"
          stroke="#2563eb"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2">
          <path d="M2 19.2L3.8 21m.9-7.2l.9 3.6m0 0l3.6.9m-3.6-.9l-2.7 2.7M16.4 3.9l-9 9l.45 2.25l2.25.45l9-9L20 3l-3.6.9Z" />
          <path d="M22 19.2L20.2 21m-.9-7.2l-.9 3.6m0 0l2.7 2.7m-2.7-2.7l-1.8.45l-1.8.45M9.3 11L4.9 6.6L4 3l3.6.9L12 8.3m.1 5.5l1.8 1.8l2.25-.45l.45-2.25l-1.8-1.8" />
        </g>
      </svg>
    </div>
  );
};

function Challenge({ player }: { player: string }) {
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isClickInsideRight = document
        .getElementById("rightDropdown")
        ?.contains(e.target as Node);
      const isClickInsideBottom = document
        .getElementById("bottomDropdown")
        ?.contains(e.target as Node);

      if (!isClickInsideRight && isRightOpen) {
        setIsRightOpen(false);
      }

      if (!isClickInsideBottom && isBottomOpen) {
        setIsBottomOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBottomOpen, isRightOpen]);

  const textBorder = `-1px -1px 0 black,
                    1px -1px 0 black,
                    -1px 1px 0 black,
                    1px 1px 0 black`;

  const clickRight = () => {
    setIsRightOpen((prev) => !prev);
    if (isBottomOpen) setIsBottomOpen(false);
  };

  const clickBottom = () => {
    setIsBottomOpen((prev) => !prev);
    if (isRightOpen) setIsRightOpen(false);
  };

  const router = useRouter();
  const dimensions = ["2D", "3D"];
  const map3D = ["cyberpunk", "autumn", "cherry", "desert", "island", "snow"];
  const map2D = ["blue", "red", "green"];
  const [dimension, setDimension] = useState("2D");
  const { socket } = useAuth();
  const [map, setMap] = useState(
    dimension === dimensions[0] ? map2D[0] : map3D[0]
  );
  const maps = dimension === "2D" ? map2D : map3D;

  const handleDimensionClick = (selectedDimension: string) => {
    setDimension(selectedDimension);
    setMap((prevMap) => (selectedDimension === "2D" ? map2D[0] : map3D[0]));
    setIsRightOpen(false);
  };

  const handleMapClick = (selectedmap: string) => {
    setMap(selectedmap);
    setIsBottomOpen(false);
  };

  const [isSearching, setIsSearching] = useState(false);
  const findMatch = () => {
    socket?.emit("inviteGame", {
      player,
      data: {
        map,
        dimension,
        mode: "Duo",
        option: "",
      },
    });
    updateBoxShadow();
  };
  const cancelMatch = () => {
    socket?.emit("cancel");
    updateBoxShadow();
  };
  useEffect(() => {
    socket?.on("loadingFriendGame", () => {
      setIsSearching(true);
    });
    socket?.on("cancelLoading", () => {
      setIsSearching(false);
    });
    socket?.on("gameStart", (path: string) => {
      router.push(path);
    });
  }, [socket, router]);

  const updateBoxShadow = () => {
    const button = document.getElementById("searchButton");
    if (button) {
      button.style.boxShadow = isSearching ? blueBoxShadow : redBoxShadow;
    }
  };
  const [time, setTime] = useState(0);

  const format = (time: number) => {
    const minutes: number = Math.floor((time / 60) % 60);
    const seconds = Math.floor(time % 60);
    const minute = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const second = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minute}:${second}`;
  };

  const timeRef = useRef<number | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSearching) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setTime(0);
    };
  }, [isSearching]);

  return (
    <>
      <div className="w-full h-1/4 text-center flex flex-col">
        <p
          className="text-white text-[50px] p-3"
          style={{ textShadow: `${textShadow}` }}>
          SETUP GAME
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className=" w-full ">
          <button
            onMouseDown={clickRight}
            className="w-full h-1/2 p-5 text-white rounded-[10px] bg-slate-900/80 text-center flex items-center flex-shrink-0">
            <div className="flex flex-1 items-center">
              <div className="text-start">
                <p>Dimension</p>
                <p>{dimension}</p>
              </div>
              <div className="flex-1 flex justify-end">
                <DropDownArrow isOpen={isRightOpen} />
              </div>
            </div>
          </button>
          <DropDownValue
            isVertical={true}
            isOpen={isRightOpen}
            click={handleDimensionClick}
            array={dimensions}
            id={"rightDropdown"}
          />
        </div>
      </div>
      <div className="w-full flex flex-col flex-start text-center gap-2.5 bg-left bg-cover rounded-2xl px-5 py-2.5 bg-slate-900/40">
        <button
          className="text-white w-full h-full flex items-center justify-between"
          onMouseDown={clickBottom}>
          <div className="flex items-center gap-2.5">
            <DoubleSword />
            <p>{map}</p>
          </div>
          <DropDownArrow isOpen={isBottomOpen} />
        </button>
        <DropDownValue
          isVertical={false}
          isOpen={isBottomOpen}
          array={maps}
          id={"bottomDropdown"}
          click={handleMapClick}
        />
      </div>
      <div className="w-full h-full flex flex-col-reverse">
        <button
          id="searchButton"
          onClick={!isSearching ? findMatch : cancelMatch}
          className={`w-full h-1/4 rounded ${
            isSearching ? " bg-red-600" : "bg-green-600"
          } text-white`}
          style={{
            transition: "box-shadow 0.5s",
            boxShadow: "none",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow = isSearching
              ? redBoxShadow
              : blueBoxShadow)
          }
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}>
          {isSearching ? "CANCEL" : "FIND MATCH"}
        </button>
        {isSearching && (
          <>
            <div
              className="w-full h-1/3 text-white text-center text-4xl"
              ref={timeRef as React.RefObject<HTMLDivElement>}>
              {format(time)}
            </div>
            <p
              className="w-full h-1/3 text-center text-white text-2xl"
              style={{ textShadow: `${textBorder}` }}>
              FINDING GAME
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default Challenge;
