// import node module libraries
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ListGroup, Card, Image, Badge } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { CustomToggle } from "./CustomToggle";
import { CustomToggleLevelTwo } from "./CustomToggleLevelTwo";

// import simple bar scrolling used for notification item scrolling
import SimpleBar from "simplebar-react";

// import routes file
import { DashboardMenu } from "DashboardRoutes.ts";
import {ChildrenItemProps, DashboardMenuProps} from "types";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";

interface SidebarProps {
    showMenu: boolean;
    toggleMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showMenu, toggleMenu }) => {
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    
    const generateLink = (item: ChildrenItemProps) => {
        return (
            <Link
                to={item.link}
                className={`nav-link ${
                    location.pathname === item.link ? "active" : ""
                }`}
                onClick={() => (isMobile ? toggleMenu() : showMenu)}
            >
                {item.name}
                {item.badge && (
                    <Badge className="ms-1" bg={item.badgecolor || "primary"}>
                        {item.badge}
                    </Badge>
                )}
            </Link>
        );
    };
    
    const wrapWithAdminCheck = (menu: DashboardMenuProps, content: JSX.Element) => {
        return menu.admin ? <ShowIfAdmin key={menu.id}>{content}</ShowIfAdmin> : content;
    };
    
    return (
        <Fragment>
            <SimpleBar style={{ maxHeight: "100vh", maxWidth: "100vw" }} className="w-auto overflow-x-hidden">
                <div className="nav-scroller">
                    <Link to="/" className="navbar-brand">
                        <Image src="/images/logo.png" style={{ height: 3.75 + "rem" }} alt="" />
                    </Link>
                </div>
                {/* Dashboard Menu */}
                <Accordion defaultActiveKey="0" as="ul" className="navbar-nav flex-column">
                    {DashboardMenu.map((menu, index) => {
                        if (menu.grouptitle) {
                            return (
                                <Card bsPrefix="nav-item" key={menu.id}>
                                    <div className="navbar-heading">{menu.title}</div>
                                </Card>
                            );
                        } else {
                            if (menu.children) {
                                const rootItem = (
                                    <Fragment key={menu.id}>
                                        <CustomToggle eventKey={menu.id} icon={menu.icon}>
                                            {menu.title}
                                            {menu.badge ? (
                                                <Badge
                                                    className="ms-1"
                                                    bg={menu.badgecolor ? menu.badgecolor : "primary"}
                                                >
                                                    {menu.badge}
                                                </Badge>
                                            ) : (
                                                ""
                                            )}
                                        </CustomToggle>
                                        <Accordion.Collapse eventKey={menu.id} as="li" bsPrefix="nav-item">
                                            <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                                                {menu.children.map((menuLevel1Item, menuLevel1Index) => {
                                                    const childKey = `${menu.id}-${menuLevel1Index}`;
                                                    if (menuLevel1Item.children) {
                                                        return (
                                                            <ListGroup.Item as="li" bsPrefix="nav-item" key={childKey}>
                                                                <Accordion className="navbar-nav flex-column">
                                                                    <CustomToggleLevelTwo eventKey={childKey}>
                                                                        {menuLevel1Item.title}
                                                                        {menuLevel1Item.badge && (
                                                                            <Badge
                                                                                className="ms-1"
                                                                                bg={menuLevel1Item.badgecolor || "primary"}
                                                                            >
                                                                                {menuLevel1Item.badge}
                                                                            </Badge>
                                                                        )}
                                                                    </CustomToggleLevelTwo>
                                                                    <Accordion.Collapse eventKey={childKey} bsPrefix="nav-item">
                                                                        <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                                                                            {menuLevel1Item.children.map((menuLevel2Item, menuLevel2Index) => (
                                                                                <ListGroup.Item
                                                                                    key={`${childKey}-${menuLevel2Index}`}
                                                                                    as="li"
                                                                                    bsPrefix="nav-item"
                                                                                >
                                                                                    {generateLink(menuLevel2Item)}
                                                                                </ListGroup.Item>
                                                                            ))}
                                                                        </ListGroup>
                                                                    </Accordion.Collapse>
                                                                </Accordion>
                                                            </ListGroup.Item>
                                                        );
                                                    } else {
                                                        return (
                                                            <ListGroup.Item
                                                                as="li"
                                                                bsPrefix="nav-item"
                                                                key={childKey}
                                                            >
                                                                {generateLink(menuLevel1Item)}
                                                            </ListGroup.Item>
                                                        );
                                                    }
                                                })}
                                            </ListGroup>
                                        </Accordion.Collapse>
                                    </Fragment>
                                );
                                return wrapWithAdminCheck(menu, rootItem);
                            } else {
                                const menuItem = (
                                    <Card bsPrefix="nav-item" key={index}>
                                        <Link
                                            to={menu.link ?? "#"}
                                            className={`nav-link ${
                                                location.pathname === menu.link ? "active" : ""
                                            } ${menu.title === "Free Download" ? "bg-primary text-white" : ""}`}
                                        >
                                            {typeof menu.icon === "string" ? (
                                                <i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
                                            ) : (
                                                menu.icon
                                            )}
                                            {menu.title}
                                            {menu.badge ? (
                                                <Badge className="ms-1" bg={menu.badgecolor || "primary"}>
                                                    {menu.badge}
                                                </Badge>
                                            ) : (
                                                ""
                                            )}
                                        </Link>
                                    </Card>
                                );
                                return wrapWithAdminCheck(menu, menuItem);
                            }
                        }
                    })}
                </Accordion>
            </SimpleBar>
        </Fragment>
    );
};

export default Sidebar;
