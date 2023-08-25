/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
      sharp: "commonjs sharp",
      "utf-8-validate": "commonjs utf-8-validate",
    });
    return config;
  },
};

module.exports = nextConfig;
