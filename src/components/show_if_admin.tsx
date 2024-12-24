import React from "react";
import { useAuth } from "components/auth.tsx";

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
