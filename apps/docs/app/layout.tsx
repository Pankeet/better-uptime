import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const alan = localFont({
  src: "../public/fonts/Alan_Sans/AlanSans-VariableFont_wght.ttf",
  variable: "--font-alan",
  display : "swap"
})

export const metadata: Metadata = {
  title: "Better Uptime",
  description: "Pankeet Manubarwala",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" > 
      <body className={`${alan.className}`}>
        {children}
      </body>
    </html>
  );
}
