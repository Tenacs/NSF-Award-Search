/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/:path*'
            : 'http://nsf.pythonanywhere.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
