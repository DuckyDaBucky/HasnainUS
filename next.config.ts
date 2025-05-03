import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 🔥 This enables static export (required for Cloudflare Pages)
};

export default nextConfig;
  
