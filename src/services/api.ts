import axios, { AxiosError } from "axios";
import { VITE_API_URL } from "../../configs/env";
import { notificationService } from "./notification";

function extractErrorMessage(error: any): string {
	if (!error) return "Unknown error";
	// axios error with response from backend
	const axiosErr = error as AxiosError;
	if (axiosErr.response && (axiosErr.response.data as any)) {
		const data = axiosErr.response.data as any;
		// common backends: { message } or { error } or { errors: [...] }
		if (typeof data === "string") return data;
		if (data.message) return String(data.message);
		if (data.error) return String(data.error);
		if (data.errors && Array.isArray(data.errors)) {
			try {
				return data.errors.map((e: any) => e.message || e).join(", ");
			} catch {
				return JSON.stringify(data.errors);
			}
		}
	}

	return (error && (error.message || String(error))) || "Network error";
}

export const api = axios.create({
	baseURL: VITE_API_URL,
	// you can enable credentials if backend requires cookies
	// withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
