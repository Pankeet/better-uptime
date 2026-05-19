"use client";
import InputForm from "@repo/ui/input";
import Image from "next/image";
import axios from "axios";
import { useState, useRef } from "react";
import toast from "react-hot-toast"

async function signup(e: React.FormEvent){
    e.preventDefault();
    const loadingToast = toast.loading("Verifying Details....");
    try{
        toast.success("Signup Successful !",{id:loadingToast});
    }catch(err){
        console.error(err);
        toast.error("Something went wrong !",{id:loadingToast});
    }
}

export default function SignUp(){  
    
    const emailRef = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [verifyemail, setVerifyEmail] = useState<boolean>(false);
    const [otpCooldown, setOtpCooldown] = useState<boolean>(false);

    async function verifyOTP(){

    setVerifyEmail(true);

    // send OTP API call here
    // await axios.post(...)

    setOtpCooldown(true);

    setTimeout(() => {
        setOtpCooldown(false);
    }, 2 * 60 * 1000);
}

    return <main className="grid lg:grid-cols-2 min-h-screen text-white" >
        <section className="flex flex-col min-h-screen bg-[#121927]">
            <div className="flex justify-center pt-7 lg:pt-8">
                 <Image src="/images/better-uptime.png" alt="better-uptime" className="items-center rounded-xl" width={100} height={100} priority/>
            </div>
            <span className="text-3xl text-center text-white pt-5">Lets get Started !</span>
            <form onSubmit={signup} className="flex flex-col justify-center lg:items-start items-center mt-10 gap-6 px-12 sm:px-10 lg:px-20">

                <InputForm type="email" label="Work Email" placeholder="jsonroy@gmail.com" isPassword={false} size="md" text_size="lg"/>

                <div className="flex justify-end w-full">
                    <button type="button" disabled={otpCooldown} className={`${otpCooldown ? "bg-gray-600 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-900"} border bg-purple-700 hover:bg-purple-900 transition-colors duration-300 text-white px-3 py-1.5 rounded-xl text-md cursor-pointer`} onClick={verifyOTP}>{otpCooldown ? "Wait 2 mins" : "verify email"}</button>
                </div>

                <div className={`${verifyemail ? "block" : "hidden"}`}>
                    <InputForm type="text" label="OTP" isPassword={true} size="xs" text_size="xs" maxLength={6}/>
                </div>

                <div>
                    <InputForm type="text" label="Password" isPassword={true} size="md" text_size="md"/>
                </div>

                <div className="lg:flex gap-7">
                    <InputForm type="text" label="First Name" placeholder="Json" isPassword={false} size="ss" text_size="sm"/>
                    <InputForm type="email" label="Last Name" placeholder="Roy" isPassword={false} size="ss" text_size="sm"/>
                </div>

                <div className="flex justify-center w-full mt-4">
                    <button type="submit" className="border bg-purple-700 hover:bg-purple-900 transition-colors duration-300 text-white px-7 py-2.5 rounded-xl text-xl cursor-pointer">Submit</button>
                </div>

            </form>
        </section>
        <section className="lg:col-span-1 hidden lg:block bg-[#273240] min-h-full" />
    </main>
}