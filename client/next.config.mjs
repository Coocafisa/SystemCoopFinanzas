import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/** @type {import('next').NextConfig} */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'src/styles');

    config.plugins.push(new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[id].css',
      }));

      

    return config;
  },
};

export default nextConfig;

