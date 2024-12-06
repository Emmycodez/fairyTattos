// pages/api/location.js

export default async function handler(req, res) {
  try {
    const data = await fetch('https://ipinfo.io/json?token=8519dfa47133bf'); 
    const locationData = await data.json();
    console.log("This is the location data: ", locationData);

    res.status(200).json(locationData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location data' });
  }
}




// export default async function handler(req, res) {
//   try {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log(`Request from IP: ${ip}`);

//     // Fetch location data using your IPinfo API key
//     const ipinfoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=8519dfa47133bf`);  // Use your actual API key here
//     const data = await ipinfoResponse.json();

//     const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${data.country}`);
//     const countryData = await countryResponse.json();

//     const locationData = {
//       ip: data.ip,
//       city: data.city,
//       region: data.region,
//       country: countryData[0].name.common,
//       continent: countryData[0].region,
//       capital: countryData[0].capital ? countryData[0].capital[0] : 'N/A',
//       currency: countryData[0].currencies ? Object.values(countryData[0].currencies).map(c => c.name).join(', ') : 'N/A',
//       phoneCode: countryData[0].idd.root,
//     };

//     res.status(200).json(locationData);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching location data' });
//   }
// }

