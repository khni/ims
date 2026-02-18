import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { refreshQueue } from "./refreshQueue.js";

export type TokenStorage = {
  getAccessToken(): Promise<string | null> | string | null;
  setAccessToken(token: string): Promise<void> | void;
  clear(): Promise<void> | void;
};

export type RefreshClient = {
  refresh(): Promise<{ accessToken: string }>;
};

type CreateAuthAxiosParams = {
  baseURL: string;
  tokenStorage: TokenStorage;
  refreshClient: RefreshClient;
};

export const createAuthAxios = ({
  baseURL,
  tokenStorage,
  refreshClient,
}: CreateAuthAxiosParams): AxiosInstance => {
  const instance = Axios.create({ baseURL });

  /* ----------------------------- Request ----------------------------- */
  instance.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getAccessToken();

    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...config.headers,

        Authorization: `Bearer ${token}`,
      } as any; //<WIP> just for now
    }

    return config;
  });

  /* ----------------------------- Response ----------------------------- */
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (refreshQueue.isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.enqueue({
            resolve: (token) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      refreshQueue.start();

      try {
        const { accessToken } = await refreshClient.refresh();
        await tokenStorage.setAccessToken(accessToken);

        refreshQueue.resolveAll(accessToken);
        return instance(originalRequest);
      } catch (err) {
        refreshQueue.rejectAll(err as Error);
        await tokenStorage.clear();
        throw err;
      } finally {
        refreshQueue.stop();
      }
    }
  );

  return instance;
};
