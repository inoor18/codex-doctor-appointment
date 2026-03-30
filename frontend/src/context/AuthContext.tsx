import { createContext, useContext, useMemo, useState } from 'react';

type User = { id: number; name: string; email: string; role: string };

type AuthContextType = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      token,
      user,
      setAuth: (nextToken: string, nextUser: User) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem('token', nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
