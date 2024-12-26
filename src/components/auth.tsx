import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {BASE_PATH} from "api";

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

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

const API_BASE_URL = BASE_PATH;
const PROTECTED_USERNAME = 'apoll011';

const ENDPOINTS = {
    me: `${API_BASE_URL}/auth/me`,
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    users: `${API_BASE_URL}/auth/users`,
    changeRole: `${API_BASE_URL}/auth/user/role`,
    changePassword: `${API_BASE_URL}/auth/user/change-password`,
    deleteUser: (username: string) => `${API_BASE_URL}/auth/user/${username}`,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3, retryDelay = 2000): Promise<Response> => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);

                if (response.ok) {
                    return response;
                }

                if (attempt === maxRetries) {
                    throw new Error(`Failed after ${maxRetries} attempts`);
                }

                await delay(retryDelay);
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                await delay(retryDelay);
            }
        }
        throw new Error('Unexpected end of retry loop');
    };

    const fetchUserData = async (token: string): Promise<void> => {
        try {
            const response = await fetchWithRetry(
                ENDPOINTS.me,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                3,  // max retries
                2000 // delay between retries in ms
            );

            const userData = await response.json();
            setUser({ ...userData, token });
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const response = await fetchWithRetry(
                ENDPOINTS.login,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                },
                3,
                2000
            );

            const data = await response.json();
            localStorage.setItem('authToken', data.access_token);
            await fetchUserData(data.access_token);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    // Update other API calls to use fetchWithRetry
    const getUsers = async (): Promise<User[]> => {
        if (!user || user.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }

        try {
            const response = await fetchWithRetry(
                ENDPOINTS.users,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
                3,
                2000
            );

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    const changeUserRole = async (username: string, newRole: string): Promise<void> => {
        if (!user || user.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }

        if (username === PROTECTED_USERNAME) {
            throw new Error('Não mecha no que não é teu.');
        }

        try {
            await fetchWithRetry(
                `${ENDPOINTS.changeRole}?username=${username}&new_role=${newRole}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                },
                3,
                2000
            );
        } catch (error) {
            console.error('Error changing user role:', error);
            throw error;
        }
    };

    const changePassword = async (newPassword: string): Promise<void> => {
        if (!user) {
            throw new Error('No user logged in');
        }

        try {
            await fetchWithRetry(
                ENDPOINTS.changePassword,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "new_password": newPassword }),
                },
                3,
                2000
            );
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    };

    const deleteUser = async (username: string): Promise<void> => {
        if (!user || (user.role !== 'admin' && user.username !== username)) {
            throw new Error('Unauthorized');
        }

        if (username === 'apoll011') {
            throw new Error('Não mecha no que não é teu.')
        }

        try {
            await fetchWithRetry(
                ENDPOINTS.deleteUser(username),
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
                3,
                2000
            );

            if (user.username === username) {
                logout();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    const register = async (username: string, password: string, role: string = 'member'): Promise<void> => {
        try {
            await fetchWithRetry(
                ENDPOINTS.register,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, role }),
                },
                3,
                2000
            );
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    };

    const logout = (): void => {
        localStorage.removeItem('authToken');
        setUser(null);
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