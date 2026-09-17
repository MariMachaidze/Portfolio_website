import { createContext } from "react";

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextValue {
  authenticated: boolean;
  loading: boolean;
  login: (password: string, totpCode: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
