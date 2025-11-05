import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppLayout } from "@/components/app-layout";
import { Providers } from "@/components/providers";
import ToastProvider from "@/components/ToastProvider";
import { TimerProvider } from "@/lib/contexts/TimerContext";
import FloatingTimer from "@/components/common/FloatingTimer";
// import SupportPopupForm from "@/components/support-tickets/modals/SupportPopupForm";

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
        <Providers>
          <ThemeProvider>
            <ToastProvider />
            <TimerProvider>
              <AppLayout>{children}</AppLayout>
              {/* <SupportPopupForm /> */}
              <FloatingTimer />
            </TimerProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
