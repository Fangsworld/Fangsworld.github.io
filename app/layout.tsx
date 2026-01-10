import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { BackgroundDecoration } from "@/components/layout/BackgroundDecoration";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-chinese",
  subsets: ["chinese-simplified"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "宇文平野 - 思维与写作的个人空间",
  description: "热爱思维与写作，分享关于阅读、写作、逻辑、言语的知识。在这个信息爆炸的时代，专注于深度思考与有效表达。",
  keywords: ["阅读", "写作", "逻辑", "言语", "思维", "表达"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${poppins.variable} ${notoSansSC.variable}`}>
      <body className={`${inter.className} ${notoSansSC.className}`} suppressHydrationWarning>
        <BackgroundDecoration />
        <Navigation />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
