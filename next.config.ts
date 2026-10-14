import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pay/:billId",
        destination: "/paymentlink/:billId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
