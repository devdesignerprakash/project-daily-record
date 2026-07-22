import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "सवारी परीक्षण कार्यालय | Vehicle Fitness Test Office",
  description: "सवारी परीक्षण कार्यालय - सवारी फिटनेस, रुट इजाजत, र सडक योग्यता प्रणाली",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ne"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-zinc-50/50 dark:bg-zinc-950">{children}</body>
    </html>
  );
}
