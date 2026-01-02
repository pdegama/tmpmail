const TOKEN_STORAGE_KEY = "anonymail_auth_token";

export const authStorage = {
    getToken: (): string | null => {
        if (typeof window === "undefined") {
            return null;
        }
        try {
            return localStorage.getItem(TOKEN_STORAGE_KEY);
        } catch (error) {
            console.error("Error reading token from localStorage:", error);
            return null;
        }
    },

    setToken: (token: string): void => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } catch (error) {
            console.error("Error saving token to localStorage:", error);
        }
    },

    clearToken: (): void => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch (error) {
            console.error("Error clearing token from localStorage:", error);
        }
    },
};

