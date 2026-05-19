"use client";
import InputForm from "@repo/ui/input";
import axios from "axios";
import { useState, useRef } from "react";
import toast from "react-hot-toast"

export default function SignUp(){  
    
    const emailRef = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [timer , setTimer] = useState(120);
    const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
    const [otpCooldown, setOtpCooldown] = useState<boolean>(false);
    const [ verifiedEmail, setVerifiedEmail ] = useState<boolean>(false);

    function tick(){
        setTimer(120);
        const interval = setInterval(() =>{
            setTimer(prev => {
                if(prev <= 1){
                    clearInterval(interval);
                    setOtpCooldown(false);
                    return 0;
                }
                else{
                    return prev-1;
                }
            })
        },1000);
    }

    async function verifyOTP(){
        if(otpCooldown) return;
        setOtpCooldown(true);
        const toast_verify_otp = toast.loading("Sending Otp...");
        const email = emailRef?.current?.value;
        if(!email){
            setOtpCooldown(false);
            toast.error("Please enter a email to verify !",{id:toast_verify_otp});
            return;
        }

        try{
            const response = await axios.post("/api/send-otp",{email});
            if(response.data?.success) {
                setVerifyEmail(true);
                tick();
                toast.success(response.data.message,{id:toast_verify_otp});
                setVerifiedEmail(true);
            }
            else{
                setOtpCooldown(false);
                setVerifyEmail(false);
                toast.error(response.data.message,{id:toast_verify_otp});
            }
        }catch(err: any){
            setVerifyEmail(false);
            setOtpCooldown(false);
            console.error(err);
            toast.error(err?.response?.data.message || "Failed to send OTP",{id:toast_verify_otp});
        }
}

async function signup(e: React.FormEvent){
    e.preventDefault();
    const loadingToast = toast.loading("Verifying Details....");

    const email = emailRef?.current?.value;
    const otp = otpRef?.current?.value;
    const password = passwordRef?.current?.value;
    const firstname = firstNameRef?.current?.value;
    const lastname = lastNameRef?.current?.value;

    if(!otp || !email) {
        toast.error("Please enter the otp to signup !",{id:loadingToast});
        return;
    }
    const data = {email,otp}
    try{
        const response = await axios.post("/api/signup/verify-otp",{data});
        console.log(response.data.message);
        if(response.data.success) {
            if(!password || !firstname || !lastname){
                toast.error("Please fill your details first !",{id:loadingToast});
                return;
            }
            const data = {
                email,password,firstname,lastname
            }
            try{
                const res = await axios.post("/api/signup",data);
                if(res.status === 200) toast.success(res?.data?.message || "Signup Successful",{id:loadingToast});
            }catch (e: unknown) {
                if (axios.isAxiosError(e)) toast.error(e.response?.data?.message || "Something went wrong" , {id:loadingToast});
                else toast.error("Server not reachable!", {id:loadingToast});
                console.error(e);
                return false;
            }
        }
    }catch(err){
        console.error(err);
        return;
    }
}

    return <main className="grid lg:grid-cols-2 min-h-screen text-white" >
        <section className="flex flex-col min-h-screen bg-[#121927]">
            <span className="text-3xl text-center text-white lg:pt-9 pt-16">Lets get Started !</span>
            <form onSubmit={signup} className="flex flex-col justify-center lg:items-start items-center mt-10 gap-6 px-12 sm:px-10 lg:px-20">
                
                <InputForm disabled={verifiedEmail} inputRef={emailRef} type="email" label="Work Email" placeholder="jsonroy@gmail.com" isPassword={false} size="md" text_size="lg"/>

                <div className="flex justify-end w-full">
                    <button type="button" disabled={otpCooldown} className={`${ otpCooldown ? "bg-gray-600 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-900 cursor-pointer"} border transition-colors duration-300 text-white px-3 py-1.5 rounded-xl text-md`} onClick={verifyOTP}>{otpCooldown ? timer + "minutes": "verify email"}</button>
                </div>

                <div className={`${verifyEmail ? "block" : "hidden"}`}>
                    <InputForm inputRef={otpRef} type="text" label="OTP" isPassword={true} size="xs" text_size="xs" maxLength={6}/>
                </div>

                <div className="-mt-3">
                    <InputForm inputRef={passwordRef} type="password" label="Password" isPassword={true} size="md" text_size="md"/>
                </div>

                <div className="lg:flex gap-7 mt-2">
                    <InputForm inputRef={firstNameRef} type="text" label="First Name" placeholder="Json" isPassword={false} size="ss" text_size="sm"/>
                    <InputForm inputRef={lastNameRef} type="text" label="Last Name" placeholder="Roy" isPassword={false} size="ss" text_size="sm"/>
                </div>

                <div className="flex justify-center w-full mt-4">
                    <button type="submit" className="border bg-purple-700 hover:bg-purple-900 transition-colors duration-300 text-white px-7 py-2.5 rounded-xl text-xl cursor-pointer mb-10">Submit</button>
                </div>

            </form>
        </section>
        <section className="lg:col-span-1 hidden lg:block bg-[#273240] min-h-full" />
    </main>
}