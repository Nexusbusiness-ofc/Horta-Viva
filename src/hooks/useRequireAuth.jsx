import { useAuth } from "@/lib/AuthContext";
import { localAuth } from "@/lib/localStorageStore";

export function useRequireAuth() {
  const { isAuthenticated, user, navigateToLogin } = useAuth();
  return () => {
    if (isAuthenticated || user || localAuth.hasToken()) return true;
    navigateToLogin();
    return false;
  };
}