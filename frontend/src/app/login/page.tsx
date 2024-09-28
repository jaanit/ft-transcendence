"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles.module.css";
import NavBar from "@/components/navBar";

export default function login() {
  return (
    <div className="z-0 relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  shadow-black shadow-2xl overflow-y-scroll no-scrollbar  w-full md:w-auto ">
      <div className="   m-auto h-[500px] w-full md:w-[500px] p-5  flex flex-col items-center justify-center  bg-slate-800 bg-opacity-40 rounded-2xl ">
        <div className="relative py-2 w-[100%] ">
          <Link
            href={process.env.NEXT_PUBLIC_API_URL + "auth/google"}
            className={`${styles.notch_button} my-12 h-2 mx-auto md:h-4 w-[80%] md:w-[400px] mt-10  relative flex justify-center items-center`}>
            <div className="z-40 text-black md:text-lg lg:text-2xl font-mono absolute ">
              Sign In with Google
            </div>
          </Link>
        </div>
        <div className="relative py-2 w-[100%] ">
          <Link
            href={process.env.NEXT_PUBLIC_API_URL + "auth/42"}
            className={`${styles.notch_button} my-12 h-2 mx-auto md:h-4 w-[80%] md:w-[400px] mt-10  relative flex justify-center items-center`}>
            <div className="z-40 text-black md:text-lg lg:text-2xl font-mono absolute ">
              Sign In with Intra 42
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
