import Cookies from "js-cookie";

const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_TOKEN!;

export const getToken = async () => {
  const cookieData = Cookies.get(COOKIE_NAME);
  const token = cookieData || null;

  return token;
};
