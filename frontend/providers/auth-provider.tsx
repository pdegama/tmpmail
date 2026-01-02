"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authStorage } from "@/lib/auth-storage";
import { setTokenUpdateCallback } from "@/lib/api";

interface AuthContextType {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedToken = authStorage.getToken();
        setTokenState(storedToken);
        setIsInitialized(true);
    }, []);

    const setToken = (newToken: string) => {
        if (newToken && newToken.trim()) {
            setTokenState(newToken);
            authStorage.setToken(newToken);
        } else {
            clearToken();
        }
    };

    const clearToken = () => {
        setTokenState(null);
        authStorage.clearToken();
    };

    useEffect(() => {
        setTokenUpdateCallback(setToken);
    }, []);

    if (!isInitialized) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ token, setToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

