"use client";
import axios from "axios";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

export default function SignUp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const [timer, setTimer] = useState(120);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  function tick() {
    setTimer(120);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpCooldown(false);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  }

  async function verifyOTP() {
    if (otpCooldown) return;
    setOtpCooldown(true);
    const toastVerify = toast.loading("Sending OTP...");
    const email = emailRef?.current?.value;
    if (!email) {
      setOtpCooldown(false);
      toast.error("Please enter an email to verify!", { id: toastVerify });
      return;
    }
    const data = { email };
    try {
      const response = await axios.post("/api/send-otp", { data });
      if (response.data?.success) {
        setVerifyEmail(true);
        tick();
        toast.success(response.data.message, { id: toastVerify });
        setVerifiedEmail(true);
      } else {
        setOtpCooldown(false);
        setVerifyEmail(false);
        toast.error(response.data.message, { id: toastVerify });
      }
    } catch (err: unknown) {
      setVerifyEmail(false);
      setOtpCooldown(false);
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to send OTP", {
          id: toastVerify,
        });
      } else {
        toast.error("Failed to send OTP", { id: toastVerify });
      }
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    const email = emailRef?.current?.value;
    const otp = otpRef?.current?.value;
    const password = passwordRef?.current?.value;
    const firstname = firstNameRef?.current?.value;
    const lastname = lastNameRef?.current?.value;

    if (!otp || !email) {
      toast.error("Please enter the OTP to sign up!", { id: loadingToast });
      setLoading(false);
      return;
    }

    const otpData = { email, otp };
    try {
      const response = await axios.post("/api/signup/verify-otp", {
        data: otpData,
      });
      if (response.data.success) {
        if (!password || !firstname || !lastname) {
          toast.error("Please fill in all your details!", {
            id: loadingToast,
          });
          setLoading(false);
          return;
        }
        const signupData = { email, password, firstname, lastname };
        try {
          const res = await axios.post("/api/signup", signupData);
          if (res.status === 200) {
            toast.success(
              res?.data?.message || "Account created successfully!",
              { id: loadingToast }
            );
            globalThis.location.href = "/profile";
          }
        } catch (e: unknown) {
          if (axios.isAxiosError(e))
            toast.error(
              e.response?.data?.message || "Something went wrong",
              { id: loadingToast }
            );
          else toast.error("Server not reachable!", { id: loadingToast });
          console.error(e);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed. Please try again.", {
        id: loadingToast,
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-white p-2 bg-black rouded-lg" />
            <span className="text-xl font-bold text-slate-900">
              Better Uptime
            </span>
          </div>
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 text-center">
                Create Account
              </h1>
              <p className="text-slate-600 text-center mt-2">
                Start monitoring your websites in minutes
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  step === 1
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Email
              </div>
              <div className="w-8 h-px bg-slate-300"></div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  step === 2
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Your Details
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Step 1: Email & OTP */}
              <div className={step === 1 ? "block" : "hidden"}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      ref={emailRef}
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 disabled:opacity-50 disabled:bg-slate-50"
                      disabled={verifiedEmail}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    disabled={otpCooldown}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                      otpCooldown
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                    }`}
                    onClick={verifyOTP}
                  >
                    {otpCooldown ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></span>
                        Resend in {formatTime(timer)}
                      </>
                    ) : verifiedEmail ? (
                      "Resend OTP"
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </div>

                <div
                  className={`mt-4 transition-all duration-300 ${
                    verifyEmail
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 hidden"
                  }`}
                >
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      ref={otpRef}
                      id="otp"
                      type={showOtp ? "text" : "password"}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 tracking-widest text-center font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showOtp ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Check your email for the verification code
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (verifyEmail) setStep(2);
                    else toast.error("Please verify your email first");
                  }}
                  className="w-full mt-6 px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Step 2: Password & Name */}
              <div className={step === 2 ? "block" : "hidden"}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        ref={firstNameRef}
                        id="firstname"
                        type="text"
                        placeholder="Jane"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      ref={lastNameRef}
                      id="lastname"
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors border border-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-600 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/signin"
                className="w-full px-4 py-3 rounded-lg bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-colors text-center border border-slate-300 block"
              >
                Sign In Instead
              </a>
              <p className="text-xs text-slate-500 text-center mt-4">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Need help?{" "}
              <a
                href="/support"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}