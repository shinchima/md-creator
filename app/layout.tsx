import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MD Creator - PDF to Markdown Converter",
  description: "Convert PDF files to Markdown format with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
