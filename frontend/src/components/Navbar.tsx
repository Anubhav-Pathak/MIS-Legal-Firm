"use client";
import React from "react";
import Button from "./UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendLogout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, company } = useSelector(
    (state: any) => state.authReducer
  );

  const logoutHandler = () => {
    console.log("logout");
    dispatch(sendLogout());
    router.push("/");
  };
  return (
    <nav className="navbar bg-red-800 flex flex-row justify-between top-0 z-50">
      {company && (
        <h1 className="text-3xl text-white btn btn-ghost">
          Welcome, {company}
        </h1>
      )}
      <div className="flex flex-row gap-4">
        <Button type="button" clickHandler={() => logoutHandler()} styles="btn">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
