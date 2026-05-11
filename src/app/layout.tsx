import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/lib/auth/auth-context';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SEVJO - Sistema de Gestión',
  description: 'Sistema de gestión integral para gimnasios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        plusJakarta.variable,
        jetbrainsMono.variable,
        inter.variable,
        'font-sans',
      )}
    >
      <body>
        <Providers>
          <TooltipProvider delay={200}>
            <AuthProvider>{children}</AuthProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
