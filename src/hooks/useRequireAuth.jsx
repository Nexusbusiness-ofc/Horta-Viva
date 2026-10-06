import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { localAuth } from "@/lib/localStorageStore";

export function useRequireAuth(defaultReturnUrl) {
  const { isAuthenticated, user, navigateToLogin } = useAuth();
  const location = useLocation();

  return (returnUrl) => {
    if (isAuthenticated || user || localAuth.hasToken()) return true;
    const target = returnUrl || defaultReturnUrl || (location.pathname + location.search);
    navigateToLogin(target);
    return false;
  };
}