const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
              },
            ],
          },
        ]
      : [];
  },
};

module.exports = nextConfig;
