// Import necessary libraries
import { Menu } from "react-feather";
import {Link, useNavigate} from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { useAuth } from 'hooks/useAuth';
import React from "react";
import {StarFill} from "react-bootstrap-icons";
import {useProfilePicture} from "hooks/useProfilePicture.tsx";

interface HeaderProps {
    toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    
    const profileImage = useProfilePicture(user?.username || "");

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <Navbar className="navbar-classic navbar navbar-expand-lg">
            <div className="d-flex justify-content-between w-100 align-items-center px-3">
                <div className="d-flex align-items-center">
                    <Link
                        to="#"
                        id="nav-toggle"
                        className="nav-icon me-3 icon-xs text-primary"
                        onClick={toggleMenu}
                    >
                        <Menu size="18px"/>
                    </Link>
                </div>

                {/* User Section */}
                <div className="d-flex align-items-center gap-3">
                    {user && (
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={profileImage}
                                alt="Foto de Perfil"
                                className="rounded-circle"
                                width="30"
                                height="30"
                            />
                            <span
                                className="fw-bold text-secondary cursor-pointer align-items-center"
                                onClick={handleProfileClick}
                                style={{cursor: 'pointer'}}
                                role="button"
                            >
                            {user.username} {isAdmin && (<StarFill></StarFill>)}
                          </span>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={logout}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Navbar>
    );
};

export default Header;
