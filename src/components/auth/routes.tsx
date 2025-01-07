import React from "react";
import {useAuth} from "hooks/useAuth.ts";
import {Navigate} from "react-router-dom";
import {LoadingSpinner} from "components/LoadingSpinner.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/auth/sign-in" />;
    }

    return <>{children}</>;
};

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};