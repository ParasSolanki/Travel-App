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
  function (config) {
    // adding artificial delay for testing
    return new Promise((rs) =>
      setTimeout(() => rs(config), Math.floor(Math.random() * 600)),
    );
  },
  function (error) {
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
