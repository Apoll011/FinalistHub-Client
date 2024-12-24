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

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (token: string): Promise<void> => {
        try {
            const response = await fetch('https://finalisthub-server.onrender.com/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser({ ...userData, token });
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, password: string, role: string = 'member'): Promise<void> => {
        try {
            const response = await fetch('https://finalisthub-server.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    };

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const response = await fetch('https://finalisthub-server.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.access_token);
            await fetchUserData(data.access_token);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = (): void => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const getUsers = async (): Promise<User[]> => {
        if (!user || user.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        try {
            const response = await fetch('https://finalisthub-server.onrender.com/auth/users', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };


    const changeUserRole = async (username: string, newRole: string): Promise<void> => {
        if (!user || user.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        if (username === 'apoll011') {
            throw new Error('Não mecha no que não é teu.')
        }

        try {
            const response = await fetch(`https://finalisthub-server.onrender.com/auth/user/role?username=${username}&new_role=${newRole}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to change user role');
            }
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
            const response = await fetch('https://finalisthub-server.onrender.com/auth/user/change-password', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "new_password": newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }
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
            const response = await fetch(`https://finalisthub-server.onrender.com/auth/user/${username}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // If the user deleted their own account, log them out
            if (user.username === username) {
                logout();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
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