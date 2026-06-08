"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if(localStorage.getItem("rememberEmail")){
      location.href="/profile";
    }
  })

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();

    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Welcome back!", { id: loadingToast });
        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
        }
        globalThis.location.href = "/profile";
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Failed to sign in. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-white p-2 bg-black rounded-lg" />
            <span className="text-xl font-bold text-slate-900">Better Uptime</span>
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
                <Activity className="w-8 h-8 text-blue-600 fill-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 text-center">
                Welcome Back
              </h1>
              <p className="text-slate-600 text-center mt-2">
                Sign in to your Better Uptime account
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                    disabled={loading}
                  />
                </div>
              </div>

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
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-slate-600 font-medium">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-600 font-medium">
                  New to Better Uptime?
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="/signup"
                className="w-full px-4 py-3 rounded-lg bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-colors text-center border border-slate-300"
              >
                Create an Account
              </a>
              <p className="text-xs text-slate-500 text-center">
                By signing in, you agree to our{" "}
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
              Having trouble signing in?{" "}
              <a href="/support" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
