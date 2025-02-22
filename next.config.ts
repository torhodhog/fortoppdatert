

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "breaking-general.aws8.tv2.no",
      },
    ],
  },
};

module.exports = nextConfig;
