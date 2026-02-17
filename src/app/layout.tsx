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
  title: "CondoGuard AI | Gestão Condominial Inteligente",
  description: "Assistente de IA para triagem de chamados, reservas automáticas e controle de acesso. O futuro da portaria autônoma.",
  openGraph: {
    title: "CondoGuard AI - O Síndico Digital",
    description: "Triagem automática, reservas e controle de acesso via inteligência artificial.",
    url: "https://condo-guard-ai.vercel.app/",
    siteName: "CondoGuard AI",
    images: [
      {
        url: "/og-image.jpg", // Placeholder, Next.js will look in public/
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: '/favicon.ico', // Ensure this exists or use a robust solution later
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
