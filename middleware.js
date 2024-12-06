// app/middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Get real client IP from the X-Forwarded-For header
  const ip = req.headers.get("X-Forwarded-For") || req.ip;
  console.log("Request headers: ", req.headers);

  if (!ip) {
    console.error("No IP address found");
    return NextResponse.next(); // or handle it gracefully if IP is missing
  }
  // You can pass this IP to your `getLocation` function to get accurate location data

  console.log(`Client IP: ${ip}`);

  const locationResponse = await fetch(
    `https://ipinfo.io/${ip}/json?token=8519dfa47133bf`
  );
  const locationData = await locationResponse.json();

  // Store the location data in the response headers to pass it to the client
  const response = NextResponse.next();
  response.headers.set("X-Client-Location", JSON.stringify(locationData));

  return response;
}

export const config = {
  matcher: ["/"], // Use this middleware for specific paths
};
