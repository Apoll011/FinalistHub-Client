import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (username: string, password: string, role?: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getUsers: () => Promise<User[]>;
    changeUserRole: (username: string, newRole: string) => Promise<void>;
    changePassword: (newPassword: string) => Promise<void>;
    deleteUser: (username: string) => Promise<void>;
    isAdmin: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const API_BASE_URL = 'https://finalisthub-server.onrender.com';
const PROTECTED_USERNAME = 'apoll011';
const AUTH_TOKEN_KEY = 'authToken';

const ENDPOINTS = {
    me: `${API_BASE_URL}/auth/me`,
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    users: `${API_BASE_URL}/auth/users`,
    changeRole: `${API_BASE_URL}/auth/user/role`,
    changePassword: `${API_BASE_URL}/auth/user/change-password`,
    deleteUser: (username: string) => `${API_BASE_URL}/auth/user/${username}`,
};

class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

const AuthContext = createContext<AuthContextType | null>(null);

const useApiRequest = (token: string | null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const handleResponse = async (response: Response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new AuthError(error || 'Request failed');
        }
        return response.json();
    };

    return async (
        url: string,
        options: RequestInit = {}
    ) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`API request failed: ${url}`, error);
            throw error;
        }
    };
};

const validateUser = (username: string) => {
    if (username === PROTECTED_USERNAME) {
        throw new AuthError('Não mecha no que não é teu.');
    }
};

const checkAdminAuthorization = (user: User | null) => {
    if (!user || user.role !== 'admin') {
        throw new AuthError('Sem Acesso: É preciso ser administrador');
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const apiRequest = useApiRequest(user?.token || null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (token) {
                try {
                    const userData = await apiRequest(ENDPOINTS.me);
                    setUser({ ...userData, token });
                } catch (error) {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initializeAuth().then(() => {});
    }, []);

    const register = async (username: string, password: string, role: string = 'member'): Promise<void> => {
        await apiRequest(ENDPOINTS.register, {
            method: 'POST',
            body: JSON.stringify({ username, password, role }),
        });
    };

    const login = async (username: string, password: string): Promise<void> => {
        const data = await apiRequest(ENDPOINTS.login, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
        const userData = await apiRequest(ENDPOINTS.me);
        setUser({ ...userData, token: data.access_token });
    };

    const logout = (): void => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
    };

    const getUsers = async (): Promise<User[]> => {
        checkAdminAuthorization(user);
        return await apiRequest(ENDPOINTS.users);
    };

    const changeUserRole = async (username: string, newRole: string): Promise<void> => {
        checkAdminAuthorization(user);
        validateUser(username);

        await apiRequest(ENDPOINTS.changeRole, {
            method: 'PATCH',
            body: JSON.stringify({ username, new_role: newRole }),
        });
    };

    const changePassword = async (newPassword: string): Promise<void> => {
        if (!user) {
            throw new AuthError('Usuario não logado.');
        }

        await apiRequest(ENDPOINTS.changePassword, {
            method: 'PATCH',
            body: JSON.stringify({ new_password: newPassword }),
        });
    };

    const deleteUser = async (username: string): Promise<void> => {
        if (!user || user.username !== username) {
            throw new AuthError('Sem Autorização: Não podes Deletar este usuario!');
        }

        checkAdminAuthorization(user)
        validateUser(username);

        await apiRequest(ENDPOINTS.deleteUser(username), {
            method: 'DELETE',
        });

        if (user.username === username) {
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                getUsers,
                changeUserRole,
                changePassword,
                deleteUser,
                isAdmin: user?.role === 'admin' || false,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};