import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUser,
    FaProjectDiagram,
    FaCode,
    FaBriefcase,
    FaEnvelope,
    FaSignOutAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa";

import "../css/Sidebar.css";


const Sidebar = ({
    unreadMessages,
    isMobileOpen,
    toggleSidebar,
    collapsed,
    toggleCollapsed
}) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");

        if (storedAdmin) {
            try {
                setAdmin(JSON.parse(storedAdmin));
            } catch (error) {
                console.error("Failed to parse admin data:", error);
            }
        }
    }, []);

    // =========================================
    // DYNAMIC SIDEBAR MENU
    // =========================================

    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: FaTachometerAlt
        },
        {
            label: "Profile",
            path: "/admin/profile",
            icon: FaUser
        },
        {
            label: "Projects",
            path: "/admin/projects",
            icon: FaProjectDiagram
        },
        {
            label: "Skills",
            path: "/admin/skills",
            icon: FaCode
        },
        {
            label: "Experience",
            path: "/admin/experience",
            icon: FaBriefcase
        },
        {
            label: "Messages",
            path: "/admin/messages",
            icon: FaEnvelope,
            badge: true
        }
    ];


    // =========================================
    // CLOSE MOBILE SIDEBAR
    // =========================================

    const closeSidebar = () => {

        if (isMobileOpen) {
            toggleSidebar();
        }

    };


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/");

    };


    // =========================================
    // ACTIVE MENU
    // =========================================

    const isActive = (path) => {

        return location.pathname === path;

    };


    return (
        <>

            <aside
                className={`
                    admin-sidebar
                    ${isMobileOpen ? "mobile-open" : ""}
                    ${collapsed ? "collapsed" : ""}
                `}
            >

                {/* =================================
                    LOGO
                ================================= */}

                <div className="admin-logo">



                    <div className="admin-logo-text">
                        <h2>
                            {admin?.name || "Admin"}
                        </h2>

                        <span>Portfolio Admin</span>
                    </div>

                    {/* Desktop / Laptop toggle */}
                    <button
                        className="sidebar-toggle-btn"
                        onClick={toggleCollapsed}
                        aria-label="Toggle sidebar"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <FaBars />
                    </button>

                    {/* Mobile close */}
                    <button
                        className="sidebar-close-btn"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* =================================
                    NAVIGATION
                ================================= */}

                <nav className="admin-nav">

                    <p className="nav-title">
                        MAIN MENU
                    </p>


                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <button
                                key={item.path}
                                className={`
                                    nav-item
                                    ${isActive(item.path)
                                        ? "active"
                                        : ""
                                    }
                                `}
                                onClick={() => {

                                    navigate(item.path);

                                    closeSidebar();

                                }}
                            >

                                <Icon />

                                <span>
                                    {item.label}
                                </span>


                                {/* Dynamic unread badge */}

                                {item.badge &&
                                    unreadMessages > 0 && (

                                        <span className="notification-badge">
                                            {unreadMessages}
                                        </span>

                                    )
                                }

                            </button>

                        );

                    })}

                </nav>


                {/* =================================
                    LOGOUT
                ================================= */}

                <button
                    className="logout-button"
                    onClick={() => {

                        handleLogout();
                        closeSidebar();

                    }}
                >

                    <FaSignOutAlt />

                    <span>
                        Logout
                    </span>

                </button>

            </aside>

        </>
    );

};


export default Sidebar;