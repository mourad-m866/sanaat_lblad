import type { Metadata } from "next";
import { SanityLive } from "@/lib/sanity.live";
import "./globals.css";

export const metadata: Metadata = {
  title: "خِدمات | حرفيّك، من حومتك",
  description: "لقَى حرفيين مهرة وموثوقين في مدينتك، واطلب الخدمة اللي محتاج بكل سهولة.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
