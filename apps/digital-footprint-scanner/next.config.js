/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,

  // 👇 CRITICAL – use the subdomain for asset loading
  assetPrefix: 'https://footprint.checkascam.co.za',

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

  // No rewrites needed – DFS serves its own routes directly
};

module.exports = nextConfig;