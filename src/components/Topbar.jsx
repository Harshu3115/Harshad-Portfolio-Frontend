
import React, { useEffect, useState } from "react";
import { FaBars, FaBell, FaMoon, FaSun } from "react-icons/fa";
import "../css/Topbar.css";

const Topbar = ({ unreadMessages = 0, toggleSidebar }) => {

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };
    let admin = {};

    try {
        admin = JSON.parse(localStorage.getItem("admin")) || {};
    } catch (error) {
        admin = {};
    }

    return (
        <header className="admin-header">
            <div className="header-left">
                <button
                    type="button"
                    className="mobile-menu"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <FaBars />
                </button>

                <div className="search-box">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search something..."
                        aria-label="Search"
                    />
                </div>
            </div>

            <div className="header-right">
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>
                <button
                    type="button"
                    className="header-icon"
                    aria-label={`${unreadMessages} unread messages`}
                >
                    <FaBell />

                    {unreadMessages > 0 && (
                        <span className="bell-badge">
                            {unreadMessages > 99 ? "99+" : unreadMessages}
                        </span>
                    )}
                </button>

                <div className="admin-user">
                    <div className="admin-avatar">
                        {admin?.name?.charAt(0)?.toUpperCase() || "H"}
                    </div>

                    <div className="admin-user-info">
                        <strong>{admin?.name || "Harshad"}</strong>
                        <span>Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
