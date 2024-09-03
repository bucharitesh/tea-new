/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: [
      "@react-email/components",
      "@react-email/render",
      "@react-email/tailwind",
    ],
  },
  images: {
    remotePatterns: [
      {
        hostname: "assets.dub.co", // for Dub's static assets
      },
    ],
  },
};
