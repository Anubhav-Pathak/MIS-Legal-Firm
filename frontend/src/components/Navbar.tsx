import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="navbar bg-red-800 flex flex-row justify-between top-0 z-50 mb-8">
      <h1 className="text-3xl text-white">Prasanna&apos;s Law Firm</h1>
      <div className="flex flex-row gap-4">
        <a className="btn bg-white normal-case text-xl text-black" href="/">Logout</a>
        <div className="btn btn-ghost btn-circle">
          <Image
            src="/user-icon.svg"
            width={50}
            height={50}
            alt="padlock"
            className="h-6 w-6"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
