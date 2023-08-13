"use client";
import React from "react";
import Button from "./UI/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendLogout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { company } = useAppSelector((state) => state.authReducer);
  const logoutHandler = () => {
    dispatch(sendLogout() as any);
    router.push("/");
  };
  return (
    <nav className="navbar justify-between top-0 z-50 px-4 bg-primary">
      <h1 className="text-xl text-neutral"><img src="/user-icon.svg" width={40} height={40} alt="User"/>&nbsp;{company}</h1>
      <Button clickHandler={() => logoutHandler()} styles="btn-ghost"> <img src="/power-button-icon.svg" width={40} height={40} /> </Button>
    </nav>
  );
};

export default Navbar;
