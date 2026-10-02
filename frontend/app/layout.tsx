import type { Metadata } from "next";
import "./globals.css";
import { getMe } from "@/lib/server-api";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AppShell } from "@/components/shell/AppShell";

export const metadata: Metadata = {
  title: "Connext — Ask without fear. Get known for what you give.",
  description:
    "Nationwide academic collaboration network. Verified-anonymous Q&A, outcome credits, and a Vibe/Pro identity.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const me = await getMe();
  const mode = me?.mode === "pro" ? "pro" : "vibe";

  return (
    <html lang="en" data-mode={mode}>
      <body className="mode-transition antialiased">
        <AuthProvider initialUser={me}>
          {me ? <AppShell user={me}>{children}</AppShell> : children}
        </AuthProvider>
      </body>
    </html>
  );
}
