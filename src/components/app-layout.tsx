"use client";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAuthCookies } from "@/lib/cookies";
import { hydrateFromCookies } from "@/redux/slices/authSlice";
// import {
//   // fetchAccessGroups,
//   // fetchLoggedInUserDetails,
//   // fetchPermissions,
//   // fetchUsers,
// } from "@/redux/slices/appSlice";
import { SidebarProvider } from "@/context/SidebarContext";
import { authPages, ProtectedRoute } from "./protected-route";
import { usePathname } from "next/navigation";
import PageLoading from "./PageLoading";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  // const {
  //   fetchedPermissions,
  //   fetchedAccessGroups,
  //   fetchedUsers,
  //   fetchedLoggedInUserDetails,
  //   loggedInUserDetails,
  // } = useAppSelector((state) => state.app);
  // const domain = loggedInUserDetails?.tenantUser?.domain;

  // const baseAllowedPages = ["/", "/lead", "/companies"];

  // const allowedPagesForDomain: Record<string, string[]> = {
  //   uptimelabs: [...baseAllowedPages, "/tasks"],
  //   generatesecurity: [...baseAllowedPages, "/tasks"],
  //   outthink: [...baseAllowedPages],
  // };

  // check if pathname is allowed for the current domain
  // const isAllowedForSpecificDomain =
  //   isRestrictedDomain &&
  //   allowedPagesForDomain[domain || ""]?.some(
  //     (page) => pathname === page || pathname.startsWith(page + "/")
  //   );

  const isAuthPage =
    authPages.includes(pathname) ||
    authPages.some((page) => pathname.startsWith(page + "/"));

  const { token, isLogin } = useAppSelector((state) => state.auth);
  const getInitDataRef = useRef(false);
  const [loading, setLoading] = useState(false);

  // On initial mount: hydrate from cookies
  useEffect(() => {
    const { token, userDetails, isLoggedIn } = getAuthCookies();

    if (token || userDetails || isLoggedIn) {
      dispatch(
        hydrateFromCookies({
          token: token || null,
          userDetails: userDetails || null,
          isLogin: isLoggedIn,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const promises = [];
        // if (!fetchedLoggedInUserDetails) {
        //   promises.push(dispatch(fetchLoggedInUserDetails()));
        // }
        // if (!fetchedPermissions) {
        //   promises.push(dispatch(fetchPermissions()));
        // }
        // if (!fetchedAccessGroups) {
        //   promises.push(dispatch(fetchAccessGroups()));
        // }
        // if (!fetchedUsers) {
        //   promises.push(dispatch(fetchUsers()));
        // }
        // await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && isLogin && !getInitDataRef.current) {
      getInitDataRef.current = true;
      fetchData();
    }
  }, [
    token,
    isLogin,
    // fetchedPermissions,
    // fetchedAccessGroups,
    // fetchedUsers,
    // fetchedLoggedInUserDetails,
    dispatch,
  ]);

  return (
    <ProtectedRoute>
      {loading ? (
        <PageLoading />
      ) : !isAuthPage ? (
        <SidebarProvider>{children}</SidebarProvider>
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
