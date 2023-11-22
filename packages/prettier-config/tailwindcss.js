const config = require('@kmuenster/prettier-config');

module.exports = {
  ...config,
  plugins: [...(config.plugins ?? []), 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
};
