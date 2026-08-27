import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prasenjit Nayak - Portfolio XP",
  description: "Prasenjit Nayak's Windows XP-themed portfolio - Full Stack Developer from Odisha, India",
  keywords: ["portfolio", "windows xp", "developer", "full stack", "react", "nextjs", "prasenjit nayak"],
  authors: [{ name: "Prasenjit Nayak" }],
  openGraph: {
    title: "Prasenjit Nayak - Portfolio XP",
    description: "Windows XP style portfolio - Full Stack Developer from Odisha, India",
    url: "https://github.com/StarKnightt/windows-xp-portfolio",
    siteName: "Prasenjit Nayak Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Prasenjit Nayak - Windows XP Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prasenjit Nayak - Portfolio XP",
    description: "Windows XP style portfolio - Full Stack Developer from Odisha, India",
    images: ["/og.png"],
    creator: "@Star_Knight12",
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
