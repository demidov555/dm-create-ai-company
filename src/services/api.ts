import axios, { AxiosError } from "axios";
import { VITE_API_URL } from "../../configs/env";
import { localStorageService } from "./localStorageService";

export interface ResponseError {
  error: string;
  message: string;
  status: number;
}

export type CommonError = AxiosError<ResponseError, any>;

export const api = axios.create({
	baseURL: VITE_API_URL,
	// withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorageService.getItem("access_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
