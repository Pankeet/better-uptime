import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@repo/ui/theme-provider";
import { ModeToggle } from "@repo/ui/mode-toggle";
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning> 
      <body className={`${alan.className}`}>
        <Toaster position="top-center" reverseOrder={false} />
         <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <header className="flex justify-between p-4">
            <ModeToggle />
          </header>

          <main>{children}</main>

        </ThemeProvider>
      </body>
    </html>
  );
}
