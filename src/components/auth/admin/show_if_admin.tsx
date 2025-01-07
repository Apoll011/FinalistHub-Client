import React from "react";
import { useAuth } from 'hooks/useAuth.ts';

interface ShowIfAdminProps {
    children: React.ReactNode;
}

const ShowIfAdmin: React.FC<ShowIfAdminProps> = ({ children }) => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
};

export default ShowIfAdmin;
