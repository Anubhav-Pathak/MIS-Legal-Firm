import React from "react";
import Image from "next/image";

const Navbar = ({company}:{company:string}) => {
  const logoutHandler = () => {
    console.log("logout");
  }
  return (
    <nav className="navbar bg-red-800 flex flex-row justify-between top-0 z-50 mb-8">
      <h1 className="text-3xl text-white">{company}</h1>
      <div className="flex flex-row gap-4">
        <button onClick={logoutHandler} className="btn bg-white normal-case text-xl text-black">Logout</button>
        <div className="btn btn-ghost btn-circle">
          <Image src="/user-icon.svg" width={50} height={50} alt="padlock" className="h-6 w-6" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
