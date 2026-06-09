import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output creates a self-contained server at
  // .next/standalone/server.js — required for Hostinger Node.js hosting
  output: "standalone",

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
