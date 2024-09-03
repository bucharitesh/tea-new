/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "assets.dub.co", // for Dub's static assets
      },
    ],
  },
};
