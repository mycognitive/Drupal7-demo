/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  //assetPrefix: '/static',
  //basePath: '/docs',
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/admin/(.*)",
        destination: "/drupal",
      },
      {
        source: "/_next/static/:path*",
        destination: "/static/:path*",
      },
    ];
  },
  // Perform customizations to webpack config.
  webpack: function (config, options) {
    console.log("Webpack version:", options.webpack.version); // 5.18.0
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules = [
      ...config.module.rules,
      { test: /\.php$/, use: "raw-loader" },
    ];
    config.plugins = [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: "./build/drupal-7.91.zip",
            to: "./static/build/",
          },
          {
            from: "./node_modules/php-wasm/php-web.wasm",
            to: "./static/php-wasm/",
          },
          {
            from: "./vendor/drupal/drupal",
            to: "./static/drupal/",
          },
        ],
      }),
    ];
    return config;
  },
};
