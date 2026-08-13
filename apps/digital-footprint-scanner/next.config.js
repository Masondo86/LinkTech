/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,

  // 👇 CRITICAL – use the subdomain for asset loading
  assetPrefix: 'https://footprint.checkascam.co.za',

  // 👇 Tell Next.js where the monorepo root is (for proper tracing)
  outputFileTracingRoot: process.cwd(), // or path.join(__dirname, '../..')

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },

  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // 🛑 REMOVE output: "standalone" – Vercel handles this automatically.
  // productionBrowserSourceMaps: false, // optional, keep if you want
};

module.exports = nextConfig;