import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://rayen-xp-portfolio.vercel.app'),
  title: "Rayen Ben Aissa - Portfolio XP",
  description: "Rayen Ben Aissa's Windows XP-themed portfolio - Full Stack Developer from Tunisia",
  keywords: ["portfolio", "windows xp", "developer", "full stack", "react", "nextjs", "rayen ben aissa"],
  authors: [{ name: "Rayen Ben Aissa" }],
  openGraph: {
    title: "Rayen Ben Aissa - Portfolio XP",
    description: "Windows XP style portfolio - Full Stack Developer from Tunisia",
    url: "https://github.com/ErenYea9er69/3D-portfolio-winxp",
    siteName: "Rayen Ben Aissa Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rayen Ben Aissa - Windows XP Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rayen Ben Aissa - Portfolio XP",
    description: "Windows XP style portfolio - Full Stack Developer from Tunisia",
    images: ["/og.png"],
    creator: "@ErenYea9er",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
