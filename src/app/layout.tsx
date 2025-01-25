import type { Metadata } from "next";
import { Fira_Code } from 'next/font/google'
import "./globals.css";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "scorelord",
  description: "scorelord",
};

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable}`}>
      <body className="font-sans">
        <main className="min-h-screen max-w-screen-lg mx-auto">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
