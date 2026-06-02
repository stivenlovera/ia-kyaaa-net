import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './public/locale/en/common.json'
  }
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set your desired limit (e.g., '2mb', '10mb', '1gb')
    },
  },
  output: 'standalone',
  images: {
    /* remotePatterns: [
      {
        protocol: "https",
        hostname: "usc1.contabostorage.com",
        port: "80",
        pathname: "/**",
      },
    ], */
    minimumCacheTTL: 120,
    remotePatterns: [{
      protocol: 'https',
      hostname: 'usc1.contabostorage.com',
      port: '',
      pathname: '/698352ccd113428cb40866703a92c514:kyaaa.net/**',
    }],

  },
  async rewrites() {
    return [
      /* {
        source: '/api/proxy/:path*',
        destination: 'https://usc1.contabostorage.com*',
      }, */
    ];
  },
  
};

export default withNextIntl(nextConfig);
