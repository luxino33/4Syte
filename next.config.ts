import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy native Node modules out of the client bundle
  serverExternalPackages: [
    "bcryptjs",
    "@anthropic-ai/sdk",
    "nodemailer",
    "pdf-lib",
  ],
};

export default nextConfig;
