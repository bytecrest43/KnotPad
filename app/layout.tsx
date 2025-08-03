// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnotPad",
  keywords: [
    "Note-taking",
    "Notes App",
    "Markdown Notes",
    "KnotPad",
    "Digital Notebook",
    "Folder Notes",
    "Organized Notes",
    "React Note App",
    "Next.js Notes",
    "Productivity Tool",
  ],
  description:
    "KnotPad is a powerful and structured note-taking app built with React and Next.js. Organize your ideas with folders, markdown support, and a clean interface designed for productivity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
