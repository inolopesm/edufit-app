import axios, { isAxiosError } from "axios";

class Exception extends Error {
  constructor(message: string) {
    super(message);
    this.name = Exception.name;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (baseURL === undefined) {
  throw new Error("VITE_API_BASE_URL is required");
}

const api = axios.create({ baseURL });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (!isAxiosError(error)) throw error;
    if (!error.response) throw error;
    const { data, status } = error.response;
    const badRequest = status >= 400 && status < 500;
    if (badRequest) throw new Exception(data?.message ?? error.message);
    throw new Error(data?.message ?? error.message);
  },
);

export { api, Exception };
