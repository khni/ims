//<WIP>
import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { webRefreshClient } from "@/src/mutator/refreshClient.web";
import { webTokenStorage } from "@/src/mutator/tokenStorage.web";
import { createAuthAxios } from "@avuny/utils/axios";
const axiosInstance = createAuthAxios({
  baseURL: process.env.NEXT_PUBLIC_BASEURL!,
  tokenStorage: webTokenStorage,
  refreshClient: webRefreshClient,
});

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const response = await axiosInstance({
    ...config,
    ...options,
  });

  return response.data as T;
};
