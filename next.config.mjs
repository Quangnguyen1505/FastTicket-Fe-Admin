
import {env} from "./src/env.mjs";

const nextConfig = {
  /* config options here */
  images: {
    domains: [`${env.NEXT_PUBLIC_HOST}`, 'lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
