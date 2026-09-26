import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-PNAS - Pediatric Nutritional Assessment System",
  description: "AI Powered Pediatric Nutritional Assessment System for detecting and classifying child malnutrition using WHO standards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
