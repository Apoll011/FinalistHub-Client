import React from "react";
import { useAuth } from 'hooks/useAuth.tsx';

interface AdminOnlyProps {
    content: string | number;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ content }) => {
    const { isAdmin } = useAuth();

    return (
        <span
            style={{
                filter: isAdmin ? "none" : "blur(7px)",
                WebkitBackdropFilter: isAdmin ? "none" : "blur(7px)",
                pointerEvents: isAdmin ? "auto" : "none",
                transition: "filter 0.3s ease, pointer-events 0.3s ease",
                display: "inline",
            }}
            className={isAdmin ? "user-select-auto" : "user-select-none"}
            onContextMenu={(e) => !isAdmin && e.preventDefault()}
        >
            {content}
        </span>
    );
};

export default AdminOnly;