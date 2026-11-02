import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/foundations/:path*", destination: "/", permanent: true },
      { source: "/resources/pages", destination: "/#pages", permanent: true },
      { source: "/components/buttons", destination: "/#button", permanent: true },
      { source: "/components/badges", destination: "/#toggle", permanent: true },
      { source: "/components/forms", destination: "/#input", permanent: true },
      { source: "/components/cards", destination: "/#card", permanent: true },
      { source: "/components/tables", destination: "/#table", permanent: true },
      { source: "/components/navigation", destination: "/#tabs", permanent: true },
      { source: "/components/overlays", destination: "/#dialog", permanent: true },
      { source: "/components/charts", destination: "/#chart", permanent: true },
      { source: "/components/feedback", destination: "/#feedback", permanent: true },
    ];
  },
};

export default nextConfig;
