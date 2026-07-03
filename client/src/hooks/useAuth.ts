import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import authService from "../services/auth.service";
import { ROUTES } from "../constants/routes";
import toast from "react-hot-toast";
import axios from "axios";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

const useAuth = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user); 
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const storeLogout = useAuthStore((state) => state.logout);

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await authService.login(data);

        if (response.success) {
          setAuth(response.data.user, response.data.token);
          toast.success(`Welcome back, ${response.data.user.name}! 👋`);
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Login failed. Please try again."
          : "Login failed. Please try again.";
        toast.error(message);
        throw error;
      }
    },
    [navigate, setAuth]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await authService.register(data);

        if (response.success) {
          setAuth(response.data.user, response.data.token);
          toast.success(
            `Account created! Welcome to TrackVault, ${response.data.user.name}! 🎉`
          );
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Registration failed. Please try again."
          : "Registration failed. Please try again.";
        toast.error(message);
        throw error;
      }
    },
    [navigate, setAuth]
  );

  const logout = useCallback(() => {
    storeLogout();
    toast.success("Logged out successfully");
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate, storeLogout]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setLoading,
  };
};

export default useAuth;
