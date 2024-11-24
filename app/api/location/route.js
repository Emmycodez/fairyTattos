// app/api/location/route.js

import { fetchLocationData } from "@/actions/locationService";



export async function GET() {
  const locationData = await fetchLocationData();

  if (!locationData) {
    return new Response('Failed to fetch location data', { status: 500 });
  }

  return new Response(JSON.stringify(locationData), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
