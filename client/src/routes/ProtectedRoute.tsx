import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import authService from "../services/auth.service";
import { getToken, isTokenExpired, removeToken } from "../utils/token.utils";
import { FullPageSpinner } from "../components/ui/Spinner";
import { ROUTES } from "../constants/routes";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        removeToken();
        logout();
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.success) {
          setAuth(response.data.user, token);
        } else {
          removeToken();
          logout();
        }
      } catch {
        removeToken();
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (isLoading) {
      initializeAuth();
    }
  }, [isLoading, setAuth, setLoading, logout]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
