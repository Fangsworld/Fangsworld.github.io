import type { Metadata } from "next";
import { pageMetadata, SITE_URL, SITE_TITLE } from "@/lib/seo";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { BackgroundDecoration } from "@/components/layout/BackgroundDecoration";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s｜宇文平野' },
  applicationName: '宇文平野',
  authors: [{ name: '宇文平野', url: SITE_URL }],
  keywords: ['人工智能', '认知科学', '内容与传播', '写作', '经济', '独立开发'],
  openGraph: pageMetadata('宇文平野', '用作品书写人生', '/').openGraph,
  twitter: pageMetadata('宇文平野', '用作品书写人生', '/').twitter,
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
