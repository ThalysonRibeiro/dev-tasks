import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Bounce, ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/modeToggle";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev tasks",
  description: "Uma aplicação moderna de gerenciamento de tarefas para desenvolvedores.",
  keywords: ["dev", "tasks", "task", "tarefas", "produtividade", "metas", "lista de metas", "kanban", "calendario",],
  openGraph: {
    title: "Dev tasks",
    images: [``],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev tasks",
    description: "Uma aplicação moderna de gerenciamento de tarefas para desenvolvedores.",
    images: [``],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <SessionAuthProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider />
              <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
              </div>
              {children}
            </ThemeProvider>
          </Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
