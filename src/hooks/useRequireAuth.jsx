import { useAuth } from "@/lib/AuthContext";

export function useRequireAuth() {
  const { isAuthenticated, navigateToLogin } = useAuth();
  return () => {
    if (isAuthenticated) return true;
    navigateToLogin();
    return false;
  };
}