const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@repo/ui'],
  env: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
  },
};

module.exports = withNextIntl(config);
