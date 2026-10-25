import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { BackgroundDecoration } from "@/components/layout/BackgroundDecoration";

export const metadata: Metadata = {
  title: "宇文平野 - 思维与写作的个人空间",
  description: "热爱思维与写作，分享关于阅读、写作、逻辑、认知的知识。在这个信息爆炸的时代，专注于深度思考与有效表达。",
  keywords: ["阅读", "写作", "逻辑", "认知", "思维", "表达"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <BackgroundDecoration />
        <Navigation />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
