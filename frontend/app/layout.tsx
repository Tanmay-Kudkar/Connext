import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Connext",
  description: "Ask without fear. Get known for what you give.",
};

const themeInitScript = `
(function() {
  try {
    var savedTheme = localStorage.getItem('connextTheme');
    var isLight = savedTheme === 'light';
    var root = document.documentElement;
    if (isLight) {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      root.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}