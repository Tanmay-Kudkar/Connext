import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Connext — Ask without fear. Get known for what you give.",
  description:
    "India's academic collaboration network. Verified-anonymous Q&A, outcome-based credits, AI teammate matching, and cross-campus communities.",
  openGraph: {
    title: "Connext",
    description: "Ask without fear. Get known for what you give.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}