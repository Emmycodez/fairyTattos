"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "./clientPage";

const Page = () => {
  const [countryDetails, setCountryDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Fetch location data from middleware or fallback to a custom function
        const res = await fetch("https://inkvotes.vercel.app/");
        const locationHeader = res.headers.get("X-Client-Location");
        const locationData = locationHeader
          ? JSON.parse(locationHeader)
          : await getLocation();

        const { country, ip, city, region } = locationData;

        // Fetch country details
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

        // Set the fetched details to state
        setCountryDetails({
          countryName,
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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!countryDetails) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <LoginForm countryDetails={countryDetails} />
    </>
  );
};

export default Page;
