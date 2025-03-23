import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["rawnaqstoore.com", "res.cloudinary.com", "noonestare-ua.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rawnaqstoore.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        // Configure Turbopack rules here
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
      };
    }
    return config;
  },
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;

// const nextConfig: NextConfig = {
//   images: {
//     domains: [],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
