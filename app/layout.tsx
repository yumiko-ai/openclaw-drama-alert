import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DramaAlert Studio",
  description: "Create professional DramaAlert-style thumbnails with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0f]`}>
        {children}
      </body>
    </html>
  );
}
