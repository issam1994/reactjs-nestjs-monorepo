import { create } from "zustand";
import axios from "axios";
import type { RegisterFormValues } from "../components/RegisterForm";
import type { LoginFormValues } from "../components/LoginForm";

type User = Partial<RegisterFormValues>;

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
  getProfile: (onDone?: () => void) => void;
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

const handleToken = (data: { access_token: string; user: User }) => {
  localStorage.setItem("access_token", data.access_token);
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  register: async (values: RegisterFormValues) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("/auth/register", values);
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  login: async (values: LoginFormValues) => {
    set({ isLoading: true, error: null });
    try {
      const { data: authData } = await axios.post("/auth/login", values);
      handleToken(authData);
      // get profile
      get().getProfile();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getProfile: async (onDone) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get("/auth/profile");
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    } finally {
      if (onDone) onDone();
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
