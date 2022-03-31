import axios, { AxiosResponse } from 'axios';

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
const BASE_URL = process.env.BASE_URL || 'http://localhost/api';

export const fetch = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: !isDev,
  headers: {
    'Content-type': 'application/json',
  },
});

fetch.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: any) => {
    if (error.response.status === 302) return Promise.resolve(error.response);
    return Promise.reject(error);
  }
);
