import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import React, { useState } from "react";
import Header from "components/navbars/topbar/Header.tsx";

const RootLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <section className="bg-light">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
        <div className="navbar-vertical navbar">
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
        </div>
        <div id="page-content">
          <Header toggleMenu={ToggleMenu}/>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default RootLayout;
