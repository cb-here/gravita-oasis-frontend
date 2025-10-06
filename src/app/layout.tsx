import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/ToastProvider";
import { TimerProvider } from "@/lib/contexts/TimerContext";
import FloatingTimer from "@/components/common/FloatingTimer";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ToastProvider />
          <TimerProvider>
            <SidebarProvider>
              {children}
              <FloatingTimer />
            </SidebarProvider>
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
