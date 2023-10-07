import {
  agentsApi,
  authApi,
  destinationsApi,
  hotelsApi,
  meApi,
  pickupPointsApi,
  oAuthApi,
  usersApi,
} from "@travel-app/api/defs";
import { Zodios } from "@zodios/core";
import axios from "axios";
import { env } from "~/env";

const API_URL = env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // adding artificial delay for testing
    return new Promise((rs) =>
      setTimeout(() => rs(config), Math.floor(Math.random() * 600)),
    );
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error &&
      error?.response &&
      (error.response.status === 401 ||
        (error?.response?.data &&
          error.response.data?.ok === false &&
          error.response.data?.error &&
          error.response.data.error.code === "UNAUTHORIZED"))
    ) {
      // manually reload the page it will reset all auth states
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export const api = new Zodios(
  API_URL,
  [
    ...authApi,
    ...meApi,
    ...destinationsApi,
    ...pickupPointsApi,
    ...usersApi,
    ...agentsApi,
    ...hotelsApi,
    ...oAuthApi,
  ],
  {
    axiosInstance,
  },
);
