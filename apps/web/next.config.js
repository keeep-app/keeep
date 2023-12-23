const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@repo/ui'],
};

module.exports = withNextIntl(config);
