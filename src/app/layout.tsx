import type { Metadata } from "next";
import { Fira_Code } from 'next/font/google'
import "./globals.css";
import Footer from "./components/footer";
import Header from "./components/header";
export const metadata: Metadata = {
  title: "scorelord",
  description: "scorelord || the cauldron is calling",
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
      <body className="font-mono">
        <main className="min-h-screen mx-auto bg-gray-900 px-5 md:px-10">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
