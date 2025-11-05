"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "./Loading";

export function getAuthCookies() {
  if (typeof document === "undefined")
    return { isLoggedIn: false, userRole: undefined };

  const cookies = document.cookie.split("; ");

  const isLoggedInCookie = cookies.find((row) =>
    row.startsWith("gravita_crm_is_logged_in=")
  );
  const userDetailsCookie = cookies.find((row) =>
    row.startsWith("gravita_crm_user_details=")
  );

  const isLoggedIn = isLoggedInCookie?.split("=")[1] === "true";

  let userRole: string | undefined = undefined;
  if (userDetailsCookie && isLoggedIn) {
    try {
      const cookieValue = userDetailsCookie.split("=").slice(1).join("=");

      let decodedValue = decodeURIComponent(cookieValue);

      if (decodedValue.includes("%")) {
        decodedValue = decodeURIComponent(decodedValue);
      }

      const parsed = JSON.parse(decodedValue);
      userRole = parsed.role;
    } catch (err) {
      console.error("Failed to parse user details cookie:", err);
      console.error("Cookie value was:", userDetailsCookie);
    }
  }

  return { isLoggedIn, userRole };
}

// Define authentication pages
export const authPages = [
  "/signin",
  "/login-with-link",
  "/login-link-verification",
  "/forgot-password",
  "/verify-otp",
  "/signup",
  "/verify-register",
  "/complete-register",
  "/register",
  "/complete-signup",
  "/activate",
  "/reset-password",
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const { isLoggedIn } = getAuthCookies();

    const isAuthPage =
      authPages.includes(pathname) ||
      authPages.some((page) => pathname.startsWith(page + "/"));

    if (!isLoggedIn) {
      if (!isAuthPage) {
        router.replace("/signin");
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
      setIsLoading(false);
      return;
    }

    if (isLoggedIn && isAuthPage) {
      router.replace("/");
      setShouldRender(false);
      setIsLoading(false);
      return;
    }

    setShouldRender(true);
    setIsLoading(false);
    return;
  }, [pathname, router]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!shouldRender) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
