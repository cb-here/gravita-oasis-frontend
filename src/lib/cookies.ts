import Cookies from "js-cookie";

const COOKIE_KEYS = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
  USER_DETAILS: process.env.NEXT_PUBLIC_USER_DETAILS!,
  IS_LOGGED_IN: process.env.NEXT_PUBLIC_IS_LOGGED_IN!
} as const;

interface UserDetails {
  id?: string;
  email?: string;
  sessionId?: string;
  role?: string;
}

interface AuthCookies {
  token: string | undefined;
  userDetails: UserDetails | null;
  isLoggedIn: boolean;
}

export const setAuthCookies = async (
  token?: string,
  userDetails?: UserDetails,
  isLoggedIn?: boolean
) => {
  if (token) {
    Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, { expires: 7 });
  }
  if (userDetails) {
    Cookies.set(COOKIE_KEYS.USER_DETAILS, JSON.stringify(userDetails), {
      expires: 7,
    });
  }
  if (isLoggedIn) {
    Cookies.set(COOKIE_KEYS.IS_LOGGED_IN, "true", { expires: 7 });
  }
};

export const getAuthCookies = (): AuthCookies => {
  const token = Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
  const userDetailsStr = Cookies.get(COOKIE_KEYS.USER_DETAILS);
  const isLoggedIn = Cookies.get(COOKIE_KEYS.IS_LOGGED_IN) === "true";

  let userDetails: UserDetails | null = null;
  if (userDetailsStr) {
    try {
      userDetails = JSON.parse(userDetailsStr);
    } catch (e) {
      console.error("Error parsing user details from cookie:", e);
    }
  }

  return {
    token,
    userDetails,
    isLoggedIn,
  };
};

export const removeAuthCookies = () => {
  Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);
  Cookies.remove(COOKIE_KEYS.USER_DETAILS);
  Cookies.remove(COOKIE_KEYS.IS_LOGGED_IN);
};

export const getSessionIdFromCookie = () => {
  const raw = Cookies.get(COOKIE_KEYS.USER_DETAILS);
  return raw ? JSON.parse(raw) : null;
};