import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ReduxProvider } from './provider';
import ToasterClient from '@/components/ToasterClient';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>
          <ThemeProvider>
            <SidebarProvider>
              <ToasterClient />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
