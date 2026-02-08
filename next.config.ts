import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    /* remotePatterns: [
      {
        protocol: "https",
        hostname: "usc1.contabostorage.com",
        port: "80",
        pathname: "/**",
      },
    ], */
    domains: ['usc1.contabostorage.com'],
  },

};

export default /* withNextIntl */(nextConfig);
