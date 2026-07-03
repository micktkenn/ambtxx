/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@amlbt/ui", "@amlbt/config", "@amlbt/types", "@amlbt/mock-data", "@amlbt/api-client"]
};

export default nextConfig;
