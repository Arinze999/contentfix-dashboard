import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/redux/ReduxProvider';
import { createClient } from '@/utils/supabase/server';
import HydrateAuth from '@/components/HydrateAuth';
import Toaster from '@/components/Toaster';
import FlashToast from '@/components/FlashToast';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const inter = Inter({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ContentFix Dashboard – Manage & Generate Content',
  description:
    'The ContentFix Dashboard gives you a centralized space to manage your conversions, track history, and generate new content instantly.',
  keywords: [
    'content dashboard',
    'AI content management',
    'content history',
    'social media generator',
    'newsletter generator',
    'ContentFix Dashboard',
  ],
  metadataBase: new URL('https://contentfix-dashboard.vercel.app/'),
  openGraph: {
    title: 'ContentFix Dashboard – Your Content Hub',
    description:
      'Access all your content conversions in one place with the ContentFix Dashboard. Generate, manage, and track your posts effortlessly.',
    url: 'https://contentfix-dashboard.vercel.app/',
    siteName: 'ContentFix Dashboard',
    images: [
      {
        url: 'https://contentfix-dashboard.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ContentFix Dashboard Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentFix Dashboard – Manage & Generate Content',
    description:
      'Use the ContentFix Dashboard to organize conversions, review history, and generate fresh posts for any platform.',
    images: ['https://contentfix-dashboard.vercel.app/twitter-card.png'],
    creator: '@your_twitter_handle',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const safeUser = {
    id: data.user?.id ?? null,
    email: data.user?.email ?? null,
    username: (data.user?.user_metadata as any)?.username ?? null,
  };

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-dark`}
      >
        <div id="modal-root"></div>
        <ReduxProvider>
          <HydrateAuth user={safeUser} /> {children}
          <Toaster />
          <FlashToast />
        </ReduxProvider>
      </body>
    </html>
  );
}
