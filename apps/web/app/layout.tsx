// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Theme } from '@radix-ui/themes';
import './globals.css';
import { ToastProvider } from '../components/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plane Clone',
  description: 'A complete Plane.so clone for personal use',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Theme appearance="dark" accentColor="indigo" grayColor="slate" panelBackground="translucent">
          <ToastProvider>
            {children}
          </ToastProvider>
        </Theme>
      </body>
    </html>
  );
}