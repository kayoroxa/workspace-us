/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/(.*)', // Aplica a política para todas as rotas
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self'; 
              connect-src 'self' https://inovasy-sells-dashboard.netlify.app;
              script-src 'self'; 
              style-src 'self'; 
              img-src 'self'; 
              frame-src 'self';
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
