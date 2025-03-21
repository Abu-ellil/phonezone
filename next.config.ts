import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["rawnaqstoore.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rawnaqstoore.com",
        pathname: "/**",
      },
    ],
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
