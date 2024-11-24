// utils/locationService.js

export async function fetchLocationData() {
  try {
    // Fetch location data from IPinfo
    const ipinfoResponse = await fetch('https://ipinfo.io/json?token=8519dfa47133bf');
    if (!ipinfoResponse.ok) {
      throw new Error(`IPinfo API request failed with status ${ipinfoResponse.status}`);
    }
    const { country, city, region, loc, ip } = await ipinfoResponse.json();

    // Fetch country details from Restcountries
    const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
    if (!countryResponse.ok) {
      throw new Error(`Restcountries API request failed with status ${countryResponse.status}`);
    }
    const [countryData] = await countryResponse.json();

    // Return combined location data
    return {
      ip,
      city,
      region,
      country: countryData.name.common,
      continent: countryData.region,
      capital: countryData.capital ? countryData.capital[0] : 'N/A',
      currency: countryData.currencies
        ? Object.values(countryData.currencies).map((c) => c.name).join(', ')
        : 'N/A',
      phoneCode: countryData.idd.root,
      loc,
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}
