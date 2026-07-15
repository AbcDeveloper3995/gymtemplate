import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym California | Entrena Fuerte, Entrena Inteligente",
  description: "Programa de fitness de élite diseñado para un rendimiento absoluto. Domina tu cuerpo, tu mente y tu entorno.",
  openGraph: {
    title: "Gym California",
    description: "Programa de fitness de élite.",
    url: "https://www.facebook.com/Gym.CaliforniaPuertoMorelos/",
    siteName: "Gym California",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
