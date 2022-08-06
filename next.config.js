/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin')
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin/(.*)',
        destination: '/drupal',
      }
    ]
  },
  // Perform customizations to webpack config.
  webpack: function (config, options) {
    console.log("Webpack version:", options.webpack.version); // 5.18.0
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };
    config.module.rules = [
      ...config.module.rules,
      { test: /\.php$/, use: 'raw-loader' }
    ];
    config.plugins = [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: "./build/drupal-8.9.20.zip",
            to: "./static/build/"
          },
          {
            from: "./node_modules/php-wasm/php-web.wasm",
            to: "./static/chunks/"
          },
          {
            from: "./node_modules/php-wasm/php-web-drupal.wasm",
            to: "./static/chunks/"
          }
        ],
      }),
    ];
    return config;
  },
}

module.exports = nextConfig
