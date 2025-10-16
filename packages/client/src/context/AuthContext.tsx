import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

type User = {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void> | void;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMe = useCallback(async () => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');
        return (await res.json()) as User;
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const me = await fetchMe();
            setUser(me);
            setError(null);
        } catch (e) {
            setUser(null);
        }
    }, [fetchMe]);

    useEffect(() => {
        (async () => {
            try {
                await refreshUser();
            } finally {
                setLoading(false);
            }
        })();
    }, [refreshUser]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/ba/sign-in/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Invalid email or password');
            }
            await refreshUser();
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Login failed');
            setUser(null);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [refreshUser]);

    const logout = useCallback(async () => {
        // Optional: implement sign-out proxy. For now, clear local state.
        setUser(null);
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        user,
        loading,
        error,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshUser,
    }), [user, loading, error, login, logout, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};
