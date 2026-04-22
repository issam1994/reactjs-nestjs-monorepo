import { create } from "zustand";
import axios from "axios";
import type { RegisterFormValues } from "../components/RegisterForm";
import type { LoginFormValues } from "../components/LoginForm";
import type { User } from "../types/User";
import { message } from "antd";
import { requestMessageFormatter } from "../utils/reqMessageFormatter";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
  getProfile: (onDone?: () => void) => void;
}

axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleToken = (data: { access_token: string; user: User }) => {
  localStorage.setItem("access_token", data.access_token);
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  register: async (values: RegisterFormValues) => {
    set({ isLoading: true });
    try {
      await axios.post("/auth/register", values);
      set({ isLoading: false });
    } catch (error) {
      message.error(requestMessageFormatter(error));
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (values: LoginFormValues) => {
    set({ isLoading: true });
    try {
      const { data: authData } = await axios.post("/auth/login", values);
      handleToken(authData);
      // get profile
      await get().getProfile();
    } catch (error) {
      message.error(requestMessageFormatter(error));
    } finally {
      set({ isLoading: false });
    }
  },
  getProfile: async (onDone) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("/auth/profile");
      set({ user: data, isLoading: false });
    } catch (error) {
      message.error(requestMessageFormatter(error));
    } finally {
      set({ isLoading: false });
      if (onDone) onDone();
    }
  },
  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null });
  },
}));
