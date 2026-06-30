import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FullPageSpinner } from "../components/ui/Spinner";
import { ROUTES } from "../constants/routes";

const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;