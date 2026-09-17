import { createContext } from "react";

export interface AuthContextValue {
  authenticated: boolean;
  loading: boolean;
  login: (password: string, totpCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
