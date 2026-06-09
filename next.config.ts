import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native Node modules out of the client bundle
  serverExternalPackages: [
    "bcryptjs",
    "@anthropic-ai/sdk",
    "nodemailer",
    "pdf-lib",
  ],

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
