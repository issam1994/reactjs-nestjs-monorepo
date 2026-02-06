import { create } from "zustand";
import axios from "axios";
import type { RegisterFormValues } from "../components/RegisterForm";
import type { LoginFormValues } from "../components/LoginForm";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleAuthResponse = (data: { access_token: string; user: User }) => {
  localStorage.setItem("access_token", data.access_token);
  return data.user;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (values: LoginFormValues) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post("/auth/login", values);
      set({ user: handleAuthResponse(data), isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (values: RegisterFormValues) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("/auth/register", values);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
