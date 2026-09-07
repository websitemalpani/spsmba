/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'spsmba.edu.in' },
      { protocol: 'https', hostname: '*.hostingersite.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/program-offered', destination: '/academics/mba', permanent: true },
      { source: '/mba-admissions', destination: '/admissions', permanent: true },
      { source: '/placement', destination: '/placements', permanent: true },
      { source: '/facilities', destination: '/campus/facilities', permanent: true },
      { source: '/fra-fees', destination: '/fees', permanent: true },
      { source: '/activities', destination: '/students', permanent: true },
    ];
  },
};
export default nextConfig;
