import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Bounce, ToastContainer } from "react-toastify";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}
