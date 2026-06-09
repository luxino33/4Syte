import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output — required for Hostinger Node.js hosting
  output: "standalone",

  // Tell webpack/turbopack not to bundle native Node.js modules
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "bcryptjs",
    "@anthropic-ai/sdk",
    "nodemailer",
    "pdf-lib",
  ],

  // Suppress the "Image" dimension warning on the landing page
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
