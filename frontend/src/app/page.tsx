"use client";
import React, { ReactHTML, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/navigation";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Toast from "@/components/UI/Toast";
import { authActions, sendLogin } from "@/redux/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {isAuthenticated, company} = useSelector((state: any) => state.authReducer);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const changeUsernameHandler = (e: any) => {
    setUsername(e.target.value);
  };
  const changePasswordHandler = (e: any) => {
    setPassword(e.target.value);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(sendLogin(username, password));
  };

  useEffect(() => {
    if (isAuthenticated && company==="iccan") {
      router.push("/dashboard/admin");
    } 
    else if (isAuthenticated) {
      router.push("/dashboard/"+company);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="/" className="text-4xl z-10 text-primary font-bold">ICCAN</a>
      <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-base-300 shadow-lg">
        <div className="space-y-4 md:space-y-6 sm:p-8 text-primary">
          <h1 className="text-xl font-bold leading-tight tracking-tight">Sign in to your account</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
            <Input label="Username" input={{type: "text", value: username, onChange: changeUsernameHandler, className: "input block mt-2 w-full"}}/>
            <Input label="Password" input={{type: "password", value: password, onChange: changePasswordHandler, className: "input block mt-2 w-full"}}/>
            <Button type="submit" styles="btn-primary">{ loading ? <span className="loading loading-spinner loading-xs"></span> : "Sign in"}</Button>
          </form>
        </div>
      </div>
      <Toast />
    </div>
  );
}
