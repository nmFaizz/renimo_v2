import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies(null, { path: '/' });

export const setToken = (name: string, value: string, options?: CookieSetOptions) => {
  cookies.set(name, value, options);
}

export const getToken = (name: string) => {
  return cookies.get(name);
}

export const removeToken = (name: string, options?: CookieSetOptions) => {
  cookies.remove(name, options);
}