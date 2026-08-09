/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: 'https://digital-trust-profile.vercel.app', // ✅ ADDED

  // ===== ORIGINAL CONFIG (keep everything) =====
  staticPageGenerationTimeout: 180,

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
  output: "standalone",
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;