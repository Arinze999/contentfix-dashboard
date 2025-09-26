import type { NextConfig } from 'next';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_HOST = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : '';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      ...(SUPABASE_HOST
        ? [
            {
              protocol: 'https',
              hostname: SUPABASE_HOST, 
              port: '',
              pathname: '/storage/v1/object/public/**',
            } as const,
          ]
        : []),

      // Google profile photos
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
