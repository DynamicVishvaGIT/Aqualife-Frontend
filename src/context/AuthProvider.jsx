import { createContext, useContext } from "react";
import { useCurrentUser } from "../features/hooks/authHooks";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useCurrentUser();

  const value = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    isError,
    refetchUser: refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};