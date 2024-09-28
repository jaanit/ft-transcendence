"use client";
import React from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useCheckAuthentication } from "../app/api/checkAuthentication";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function Auth() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/tfa") return <></>
  return <CheckAuth/>
}

export function CheckAuth()
{
  const {
    isAuthenticated,
    dataUser,
    login,
    logout,
    setuserdata,
    setuserdatanull,
  } = useAuth();
  const router = useRouter();
  const { data, isLoading, isError, error} = useCheckAuthentication();
  useEffect(() => {
    if (!isLoading || isError) {
      if (data?.isAuthenticated) {
        login(data.user);
      } else {
        logout();
        router.push("/login");
      }
    }
  }, [isLoading, data, isError, error, logout, login, router]);
  
  return <div></div>;
}
