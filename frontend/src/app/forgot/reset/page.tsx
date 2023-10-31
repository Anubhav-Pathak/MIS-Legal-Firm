"use client"
import React, { useRef, useState } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { toastActions } from '@/redux/slices/uiSlice';

import Button from "@/components/UI/Button";
import Toast from "@/components/UI/Toast";
import Input from '@/components/UI/Input';
import { resetPassword } from '@/utils/API';

const Reset = () => {
    const dispatch = useAppDispatch();
    const code = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const confirmPassword = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password.current?.value !== confirmPassword.current?.value) {
            dispatch(toastActions.showToast({ message: "Passwords do not match", type: "error" }));
            return;
        }
        setLoading(true);
        const response = await resetPassword(code.current?.value as string, password.current?.value as string, localStorage.getItem("username"), localStorage.getItem("email"));
        if (response.ok) {
            dispatch(toastActions.showToast({ message: "Password reset successfully", type: "success" }));
            window.location.href = "/";
            localStorage.removeItem("username");
            localStorage.removeItem("email");
        } else {
            dispatch(toastActions.showToast({ message: response, type: "error" }));
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="/" className="text-4xl z-10 text-primary font-bold"> ICCAN </a>
            <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-base-300 shadow-lg">
                <div className="space-y-4 md:space-y-6 sm:p-8 text-primary">
                <h1 className="text-xl font-bold leading-tight tracking-tight"> Reset Password </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                    <Input
                        label="Verification Code"
                        ref = {code}
                        input={{
                            type: "text",
                            className: "input block mt-2 w-full",
                        }}
                    />  
                    <Input
                        label="Password"
                        ref = {password}
                        input={{
                            type: "password",
                            className: "input block mt-2 w-full",
                        }}
                    />  
                    <Input
                        label="Confirm Password"
                        ref = {confirmPassword}
                        input={{
                            type: "password",
                            className: "input block mt-2 w-full",
                        }}
                    />  
                    <Button type="submit" styles="btn-primary">{ loading ? <span className="loading loading-spinner loading-xs"></span> : "Reset" }</Button>
                </form>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default Reset;
