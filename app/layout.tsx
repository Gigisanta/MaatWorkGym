import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono, Geist, Syne } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GymPro - Sistema de Gestión",
  description: "Sistema de gestión integral para gimnasios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(plusJakarta.variable, dmSans.variable, jetbrainsMono.variable, syne.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1" style={{ marginLeft: "var(--sidebar-width, 200px)" }}>
          <Providers>
            <TooltipProvider delay={200}>
              {children}
            </TooltipProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}
