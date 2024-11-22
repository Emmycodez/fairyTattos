/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['inkvote-bucket-one.s3.eu-north-1.amazonaws.com'], // Add your S3 bucket domain here
  },
};

export default nextConfig;