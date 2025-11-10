import axios, { AxiosError } from "axios";
import { VITE_API_URL } from "../../configs/env";
import { localStorageService } from "./localStorageService";

export const api = axios.create({
	baseURL: VITE_API_URL,
	// you can enable credentials if backend requires cookies
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
