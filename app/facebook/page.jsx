import React from "react";
import LoginForm from "./clientPage";
import { getLocation } from "@/actions/queries";

const page = async () => {
  const locationData = await getLocation();
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
      (countryInfo.idd.suffixes ? countryInfo.idd.suffixes.join(", ") : "")
    : "Unknown";

  const capital = countryInfo.capital[0] || "Unknown";

  // we need ip, city, region, country, continent, currency, phoneCode
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
