"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  // all of this is dummy code until we get the backend up and running
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (username && password) {
      setShowSuccess(true);
      setShowError(false);
      setUsername("");
      setPassword("");
    } else {
      setShowError(true);
      setShowSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg w-1/2 h-[32rem] p-16 relative flex flex-col justify-end gap-8 drop-shadow-xl">
        <div
          className="w-full h-1/2 bg-red-800 top-0 left-0 absolute"
          style={{ clipPath: `polygon(0 0, 100% 0, 0 100%)` }}
        ></div>
        <h2 className="text-5xl font-bold mb-8 absolute -left-10 -top-10 text-white drop-shadow-2xl">
          <span className="text-9xl text-black">P</span>rasanna&apos;s Law Firm
        </h2>

        {showError || showSuccess ? (
          <div
            className={`alert alert-${
              showError ? "error" : "success"
            } shadow-lg z-10`}
          >
            <div>
              <span>
                {showError
                  ? "Warning: Invalid username or password!"
                  : "Your login is successful!"}
              </span>
            </div>
          </div>
        ) : null}

        <form
          className="flex flex-col items-center justify-center gap-4 z-10"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Enter your username"
              className={`input input-bordered input-${
                showError ? "error" : "primary"
              } bg-gray-300 pr-10 w-full max-w-lg focus:outline-none text-black text-[24px]`}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <Image
              src="/user-icon.svg"
              width={50}
              height={50}
              alt="padlock"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6"
            />
          </div>
          <div className="relative w-full max-w-lg">
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered input-${
                showError ? "error" : "primary"
              } bg-gray-300 pr-10 w-full max-w-lg focus:outline-none text-black text-[24px]`}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Image
              src="/padlock-icon.svg"
              width={50}
              height={50}
              alt="padlock"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6"
            />
          </div>
          <button
            className={`btn btn-primary text-white text-[16px] max-w-sm w-full ${
              loading ? "btn-disabled" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="border-t-transparent border-solid animate-spin rounded-full border-white border-8"></div>
                <span>Logging you in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
