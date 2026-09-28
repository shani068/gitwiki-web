// Root layout — sets up fonts, global styles, and wraps the tree in all providers
import type { Metadata } from "next";

import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

import { APP_NAME } from "@/constants/config";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets:  ["latin"],
  weight:   ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets:  ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:  APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: "A living, searchable wiki generated from your Git repositories.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
