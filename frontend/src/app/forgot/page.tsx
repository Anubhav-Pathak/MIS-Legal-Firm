"use client"
import React, { useState } from 'react';

import { getOTP } from '@/utils/API';
import { useAppDispatch } from '@/redux/hooks';
import { toastActions } from '@/redux/slices/uiSlice';

import Button from "@/components/UI/Button";
import Toast from "@/components/UI/Toast";
import Input from '@/components/UI/Input';

const ForgotPasswordPage = () => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const response = await getOTP(username.trim(), email.trim());
        if (response.ok) {
            window.localStorage.setItem('username', username.trim());
            window.localStorage.setItem('email', email.trim());
            window.location.href = '/forgot/reset';
        }
        else {  
            dispatch(toastActions.showToast({ message: response, type: "success" }));
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="/" className="text-4xl z-10 text-primary font-bold"> ICCAN </a>
            <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-base-300 shadow-lg">
                <div className="space-y-4 md:space-y-6 sm:p-8 text-primary">
                <h1 className="text-xl font-bold leading-tight tracking-tight"> Forgot Password ? </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                    <Input
                        label="Username"
                        input={{
                            type: "text",
                            value: username,
                            onChange: (event) => setUsername(event.target.value),
                            className: "input block mt-2 w-full",
                        }}
                    />  
                    <div className="divider">OR</div>
                    <Input 
                        label="Registered Email"
                        input={{
                            type: "email",
                            value: email,
                            onChange: (event) => setEmail(event.target.value),
                            className: "input block mt-2 w-full",
                        }}
                    />
                    <Button type="submit" styles="btn-primary">{ loading ? <span className="loading loading-spinner loading-xs"></span> : "Get OTP" }</Button>
                </form>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default ForgotPasswordPage;
