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
  title: 'ContentFix Dashboard – Create, Enhance & Save AI Posts',
  description:
    'The ContentFix Dashboard helps you create, enhance, and save AI-generated posts for your favorite social platforms like LinkedIn and Twitter. Manage your ideas, refine your drafts, and publish smarter with ContentFix.',
  keywords: [
    'AI content creation',
    'social media dashboard',
    'LinkedIn post generator',
    'Twitter content enhancer',
    'AI writing tool',
    'content management',
    'ContentFix Dashboard',
  ],
  metadataBase: new URL('https://contentfix-dashboard.vercel.app/'),

  openGraph: {
    title: 'ContentFix Dashboard – Your AI-Powered Social Media Hub',
    description:
      'Create, enhance, and organize your AI-generated posts for LinkedIn, Twitter, and more—all from one intuitive dashboard.',
    url: 'https://contentfix-dashboard.vercel.app/',
    siteName: 'ContentFix Dashboard',
    images: [
      {
        url: 'https://t4.ftcdn.net/jpg/05/34/12/71/360_F_534127141_WLe9sk0MTVS5PxsB3yROZ3lItE4evzr7.jpg',
        width: 1200,
        height: 630,
        alt: 'ContentFix Dashboard Preview',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ContentFix Dashboard – Create, Enhance & Save AI Posts',
    description:
      'Use the ContentFix Dashboard to craft and polish AI-generated posts for LinkedIn, Twitter, and other platforms—all in one place.',
    images: [
      'https://t4.ftcdn.net/jpg/05/34/12/71/360_F_534127141_WLe9sk0MTVS5PxsB3yROZ3lItE4evzr7.jpg',
    ],
    creator: '@arinze',
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
