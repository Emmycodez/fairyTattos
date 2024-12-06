// app/page.js (or the parent component where you fetch location)
import React from "react";
import LoginForm from "./clientPage";
import { getLocation } from "@/actions/queries";

const page = async () => {
  // Fetch location data from the middleware-provided header
  const res = await fetch("https://inkvotes.vercel.app/");
  const locationHeader = res.headers.get("X-Client-Location");
  const locationData = locationHeader
    ? JSON.parse(locationHeader)
    : await getLocation();

  const { country, ip, city, region } = locationData;

  const countryResponse = await fetch(
    `https://restcountries.com/v3.1/alpha/${country}`
  );

  if (!countryResponse) {
    throw new Error("Failed to fetch country data");
  }

  const countryData = await countryResponse.json();
  const countryInfo = countryData[0];

  const countryName = countryInfo?.name.common;
  const continent = countryInfo.continents
    ? countryInfo.continents[0]
    : "Unknown";
  const currency = countryInfo.currencies
    ? Object.keys(countryInfo.currencies)[0]
    : "Unknown";
  const phoneCode = countryInfo.idd
    ? countryInfo.idd.root +
      (countryInfo.idd.suffixes && countryInfo.idd.suffixes.length > 0
        ? countryInfo.idd.suffixes[0] // Get the first suffix only
        : "")
    : "Unknown";

  const capital = countryInfo.capital[0] || "Unknown";

  const countryDetails = {
    countryName,
    ip,
    city,
    region,
    continent,
    capital,
    currency,
    phoneCode,
  };

  return (
    <>
      <LoginForm countryDetails={countryDetails} />
    </>
  );
};

export default page;
