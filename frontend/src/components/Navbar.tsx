"use client";
import React from "react";
import Image from "next/image";
import Button from "./UI/Button";

const Navbar = ({company}:{company:string}) => {
  const logoutHandler = () => {
    console.log("logout");
  }
  return (
    <nav className="navbar bg-red-800 flex flex-row justify-between top-0 z-50">
      <h1 className="text-3xl text-white">{company}</h1>
      <div className="flex flex-row gap-4">
        <Button type="button" clickHandler={logoutHandler} styles="btn">Logout</Button>
        <div className="btn btn-ghost btn-circle"><Image src="/user-icon.svg" width={50} height={50} alt="User" className="h-6 w-6" /></div>
      </div>
    </nav>
  );
};

export default Navbar;
