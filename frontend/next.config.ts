import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    NEXT_PUBLIC_API_BASE_URI:process.env.API_BASE_URI,
    NEXT_PUBLIC_FRONTEND_BASE_URI:process.env.FRONTEND_BASE_URI
  }
};

export default nextConfig;
