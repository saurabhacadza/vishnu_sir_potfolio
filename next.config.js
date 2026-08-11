// /** @type {import('next').NextConfig} */
// module.exports = {
//   // experimental: { tsconfigPaths: true },
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'drive.google.com' },
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
//     ],
//   }
// };


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
};

module.exports = nextConfig;
