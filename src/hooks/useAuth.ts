import {createContext, useContext} from "react";

export interface User {
    id: number;
    username: string;
    role: string;
    token: string;
}

export interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};