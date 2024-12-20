"use server";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.MY_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

// Function to generate a random name for the image
function generateRandomFileName(extension) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string
  return `${randomString}-${timestamp}.${extension}`; // Combine them to form the filename
}

// Function to get signed URL for uploading an image
export async function getSignedURL(name, extension) {
  const randomFileName = generateRandomFileName(extension); // Generate a random filename

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.MY_AWS_BUCKET_NAME,
    Key: randomFileName,
    Metadata: {
      name: name, // Store the contestant's name as metadata
    },
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 3600, // URL expires in 1 hour
  });

  return { success: { url: signedUrl, filename: randomFileName } }; // Return the signed URL and the filename
}

// Function to fetch images and their metadata from S3
export async function fetchImages() {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.MY_AWS_BUCKET_NAME,
  });

  const response = await s3.send(listCommand);
  const items = [];

  for (const item of response.Contents) {
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.MY_AWS_BUCKET_NAME,
      Key: item.Key,
    });

    const headResponse = await s3.send(headCommand);
    items.push({
      id: item.Key, // or any unique identifier
      name: headResponse.Metadata.name, // Get the name from metadata
      image: item.Key, // The S3 key for the image
    });
  }

  return items; // Return the array of images with metadata
}

export async function deleteImage(key) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.MY_AWS_BUCKET_NAME,
    Key: key, // The key of the image to delete
  });

  try {
    await s3.send(deleteCommand);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Error deleting image" };
  }
}

// actions/queries.js
export async function getLocation(ip = null) {
  try {
    // Use provided IP or get the IP from the request (if available)
    const locationEndpoint = ip
      ? `https://ipinfo.io/${ip}/json?token=8519dfa47133bf`
      : `https://ipinfo.io/json?token=8519dfa47133bf`;
      
    const data = await fetch(locationEndpoint, { cache: "no-cache" });
    const locationData = await data.json();
    return locationData;
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
}


export async function getCountryInfo() {
  try {
    const { country } = await getLocation();
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${country}`
    );
    console.log("This is the country data response: ",response);
    return response.json();
  } catch (error) {
    console.error("Error getting country data: ", error);
  }
}
