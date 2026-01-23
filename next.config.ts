import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '**/*.{tsx,jsx}': {
        loaders: [
          {
            loader: '@locator/webpack-loader',
            options: { env: 'development' },
          },
        ],
      },
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.(tsx|jsx)$/,
        use: {
          loader: '@locator/webpack-loader',
          options: { env: 'development' },
        },
      });
    }
    return config;
  },
};

export default nextConfig;
