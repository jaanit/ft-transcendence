"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const TfaPage = () => {
  const [userInput, setUserInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [isButtonAvailable, setIsButtonAvailable] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    setNickname(params.nickname);
  }, []);

  const [error, setError] = useState("");

  const verifyTfaCode = async (e: any) => {
    try {
      const response = await API.get("user/getUserInfo", {
        params: { nickname: nickname },
      });
      if (response.data.userInfo) {
        const verifyResponse = await API.post("user/verifyTfa", {
          code: userInput,
          UserInfo: response.data.userInfo,
        });
        if (verifyResponse.data.isVerified) {
          e.preventDefault();
          router.push("/");
        } else {
          setError(verifyResponse.data.message);
        }
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonAvailable(true);
    }, 2 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [isButtonAvailable]);

  const resendCode = async () => {
    setIsButtonAvailable(false);
    try {
      const response = await API.get("/user/getUserInfo", {
        params: { nickname: nickname },
      });
      if (response.data.userInfo) {
        await API.post("/auth/sendEmail", {
          UserInfo: response.data.userInfo,
        });
      }
    } catch (e) {
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      verifyTfaCode(event);
    }
  };

  const handleUserInput = (event: any) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="z-0 w-full md:w-[500px] h-1/2 relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
      <div className="w-full overflow-auto h-full  md:bg-opacity-70 md:bg-slate-950   text-white  m-auto rounded-2xl p-10">
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <span>Provide the 6-digit code received in your email.</span>
          <input
            placeholder="Enter code"
            value={userInput}
            onKeyDown={handleKeyPress}
            onChange={handleUserInput}
            className="rounded-full text-center text-black h-[40px] w-[150px]"
          />
          {error !== "" ? <p className="text-red-600">Try Again!</p> : null}
          <div className="buttons flex gap-10">
            <button
              onClick={resendCode}
              disabled={!isButtonAvailable}
              className={`text-white bg-blue-700 hover:bg-blue-800 w-[100px] h-[30px] rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${
                !isButtonAvailable && "opacity-50 cursor-not-allowed"
              }`}
            >
              Resend
            </button>
            <button
              onClick={verifyTfaCode}
              className="text-white bg-blue-700 hover:bg-blue-800 w-[100px] h-[30px] rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TfaPage;
