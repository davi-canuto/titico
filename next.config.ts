import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/lobby", permanent: true },
      { source: "/dashboard/:path*", destination: "/lobby/:path*", permanent: true },
    ]
  },
};

export default nextConfig;
