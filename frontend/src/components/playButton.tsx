import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import styles from "../app/styles.module.css";
import { useAuth } from "./providers/AuthContext";
import { set } from "react-hook-form";

interface PlayButtonProps {
  isAuthenticated: boolean;
}

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
  dimension?: string;
  click: (value: string) => void;
}

function DropDownValue({
  isOpen,
  isVertical,
  array,
  id,
  click,
  dimension,
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
            className="text-white px-5 py-2.5"
            key={index}
            onClick={() => click(value)}>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CheckboxProps {
  value: string;
  handleCheckboxChange: (value: string) => void;
}

function Checkbox({ value, handleCheckboxChange }: CheckboxProps) {
  return (
    <li className="w-full" key={value}>
      <div className="flex items-center text-start gap-2.5 px-5 bg-slate-900/40 rounded-[10px]">
        <input
          id={value}
          type="checkbox"
          value={value}
          onChange={() => handleCheckboxChange(value)}
          className="w-4 h-4 text-black"
          style={{ filter: "drop-shadow(2px 2px 8px rgba(38, 99, 235, 0.8))" }}
        />
      </div>
    </li>
  );
}

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

const HorizontalLine = () => {
  return (
    <div className="h-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="500"
        height="2"
        viewBox="0 0 500 2"
        fill="none">
        <path
          d="M0 1H500"
          stroke="white"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

function PlayButton({ isAuthenticated }: PlayButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { socket } = useAuth();
  const handleLinkClick = (e: any) => {
    e.preventDefault();
    isAuthenticated ? setShowModal(true) : router.push("/login");
  };

  // const handleCloseModal = () => {
  //   socket?.emit("cancel");
  //   setShowModal(false);
  // };

  const modalRef = useRef<HTMLDivElement>(null);

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const modes = ["Duo", "Bot"];
  const dimensions = ["3D", "2D"];
  const map3D = ["cyberpunk", "autumn", "cherry", "desert", "island", "snow"];
  const map2D = ["blue", "red", "green"];
  const [Mode, setMode] = useState("Bot");
  const [dimension, setDimension] = useState("3D");
  const [map, setMap] = useState(
    dimension === dimensions[0] ? map3D[0] : map2D[0]
  );
  const [msg, setMsg] = useState("");
  const maps = dimension === "2D" ? map2D : map3D;
  const [time, setTime] = useState(0);
  const [gameIsSet, setGameIsSet] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isClickInsideLeft = document
        .getElementById("leftDropdown")
        ?.contains(e.target as Node);
      const isClickInsideRight = document
        .getElementById("rightDropdown")
        ?.contains(e.target as Node);
      const isClickInsideBottom = document
        .getElementById("bottomDropdown")
        ?.contains(e.target as Node);

      if (!isClickInsideLeft && isLeftOpen) {
        setIsLeftOpen(false);
      }

      if (!isClickInsideRight && isRightOpen) {
        setIsRightOpen(false);
      }

      if (!isClickInsideBottom && isBottomOpen) {
        setIsBottomOpen(false);
      }

      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        socket?.emit("cancel");
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, isBottomOpen, isLeftOpen, isRightOpen, socket]);

  const textShadow = `0px 0px 5px black, 0px 0px 20px white, 0px 0px 40px white, 0px 0px 80px white`;
  const clickLeft = () => {
    setIsLeftOpen((prev) => !prev);
    if (isBottomOpen) setIsBottomOpen(false);
    if (isRightOpen) setIsRightOpen(false);
  };

  const clickRight = () => {
    setIsRightOpen((prev) => !prev);
    if (isBottomOpen) setIsBottomOpen(false);
    if (isLeftOpen) setIsLeftOpen(false);
  };

  const clickBottom = () => {
    setIsBottomOpen((prev) => !prev);
    if (isLeftOpen) setIsLeftOpen(false);
    if (isRightOpen) setIsRightOpen(false);
  };

  const handleModeClick = (selectedMode: string) => {
    setMode(selectedMode);
    setIsLeftOpen(false);
  };

  const handleDimensionClick = (selectedDimension: string) => {
    setDimension(selectedDimension);
    setMap((prevMap) => (selectedDimension === "2D" ? map2D[0] : map3D[0]));
    setIsRightOpen(false);
  };

  const handleMapClick = (selectedmap: string) => {
    setMap(selectedmap);
    setIsBottomOpen(false);
  };

  const cancelMatch = () => {
    socket?.emit("cancel");
    setMsg("");
    setTime(0);
    updateBoxShadow();
  };
  const findMatch = () => {
    if (isSearching) return;
    socket?.emit("joinQueue", {
      mode: Mode,
      dimension: dimension,
      map: map,
      option: "",
    });
    updateBoxShadow();
  };

  const rejoinMatch = () => {
    socket?.emit("rejoin");
    updateBoxShadow();
  };

  useEffect(() => {
    socket?.on("ERROR", (msg: string) => {
      // setIsSearching(false);
      setMsg(msg);
      setTime(0);
      if (msg === "you are already in a game" && !gameIsSet) {
        setGameIsSet(true);
        setIsSearching(true);
        //   socket?.emit("rejoin");
      }
    });
    socket?.on("startLoading", () => {
      setIsSearching(true);
    });
    socket?.on("cancelLoading", () => {
      setGameIsSet(false);
      setIsSearching(false);
      setTime(0);
    });
    socket?.on("gameStart", (path: string) => {
      setIsSearching(true);
      router.push(path);
    });
  }, [socket, gameIsSet, router]);
  const updateBoxShadow = () => {
    const button = document.getElementById("searchButton");
    if (button) {
      button.style.boxShadow = isSearching ? blueBoxShadow : redBoxShadow;
    }
  };

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
  //   if (gameIsSet) return <></>;
  return (
    <>
      <a
        href={isAuthenticated ? "/play" : "/login"}
        onClick={handleLinkClick}
        className={`${styles.notch_button} my-12 h-2 md:h-4 w-3/5 relative flex justify-center items-center`}>
        <div className=" z-10 text-black md:text-lg lg:text-2xl font-mono absolute">
          {isAuthenticated ? "Play Now " : "Sign In"}
        </div>
      </a>

      {showModal && (
        <div
          ref={modalRef}
          className={`modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[688px] z-20`}>
          <div className="w-full h-full flex flex-col items-center gap-[30px] rounded-[10px] p-[30px] bg-slate-950/70 backdrop-blur-xl">
            <div className="w-full h-[180px] text-center">
              <p
                className="text-white text-[60px]"
                style={{ textShadow: `${textShadow}` }}>
                SETUP
              </p>
              <p
                className="text-white text-[60px]"
                style={{ textShadow: `${textShadow}` }}>
                GAME
              </p>
            </div>
            <div className="text-[#f00] text-[15px]">{msg}</div>
            <div className="flex gap-[20px] items-center justify-center w-full">
              <div className="flex-1 h-[74px] w-1/2">
                <button
                  onMouseDown={clickLeft}
                  className="w-full h-full p-5 text-white bg-slate-900/80 text-center flex items-center flex-shrink-0 rounded-[10px]">
                  <div className="flex flex-1 items-center">
                    <div className="text-start">
                      <p>Mode</p>
                      <p>{Mode}</p>
                    </div>
                    <div className="flex-1 flex justify-end">
                      <DropDownArrow isOpen={isLeftOpen} />
                    </div>
                  </div>
                </button>
                <DropDownValue
                  isVertical={true}
                  isOpen={isLeftOpen}
                  click={handleModeClick}
                  array={modes}
                  id={"leftDropdown"}
                />
              </div>
              <div className="flex-1 h-[74px] w-1/2 ">
                <button
                  onMouseDown={clickRight}
                  className="w-full h-full p-5 text-white rounded-[10px] bg-slate-900/80 text-center flex items-center flex-shrink-0">
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
                dimension={dimension}
                id={"bottomDropdown"}
                click={handleMapClick}
              />
              <HorizontalLine />
            </div>
            {gameIsSet ? (
              <div className="w-full h-full flex flex-row">
                <button
                  id="searchButton"
                  onClick={rejoinMatch}
                  className={`w-1/2 h-1/3 rounded bg-green-600 text-white`}
                  style={{
                    transition: "box-shadow 0.5s",
                    boxShadow: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.boxShadow = isSearching
                      ? redBoxShadow
                      : blueBoxShadow)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }>
                  JOIN
                </button>
                <button
                  id="searchButton"
                  onClick={cancelMatch}
                  className={`w-1/2 h-1/3 rounded  bg-red-600 text-white`}
                  style={{
                    transition: "box-shadow 0.5s",
                    boxShadow: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.boxShadow = isSearching
                      ? redBoxShadow
                      : blueBoxShadow)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }>
                  CANCEL
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col-reverse">
                <button
                  id="searchButton"
                  onClick={!isSearching ? findMatch : cancelMatch}
                  className={`w-full h-1/3 rounded ${
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
                  onMouseOut={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }>
                  {isSearching ? "CANCEL" : "FIND MATCH"}
                </button>
                {isSearching ? (
                  <>
                    <div
                      className="w-full h-1/3 text-white text-center text-4xl"
                      ref={timeRef as React.RefObject<HTMLDivElement>}>
                      {format(time)}
                    </div>
                    <p
                      className="w-full h-1/3 text-center text-white text-2xl"
                      style={{ textShadow: `${textShadow}` }}>
                      FINDING GAME
                    </p>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PlayButton;
