import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
    FaPlus,
    FaArrowUp,
    FaEye,
    FaBars,
    FaBell,
    FaProjectDiagram,
    FaCode,
    FaBriefcase,
    FaEnvelope,
} from "react-icons/fa";

import "../css/AdminDashboard.css";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experience: 0,
        messages: 0,
        unreadMessages: 0
    });

    const [loading, setLoading] = useState(true);
    const [recentMessages, setRecentMessages] = useState([]);
    const [visitorStats, setVisitorStats] = useState([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


    const [visitorDays, setVisitorDays] = useState(7);
    const [visitorLoading, setVisitorLoading] = useState(false);

    const toggleSidebar = () => {
        setIsMobileOpen((prev) => !prev);
    };



    const toggleSidebarCollapsed = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    const admin = JSON.parse(
        localStorage.getItem("admin")
    );

    useEffect(() => {

        const fetchVisitorStats = async () => {

            try {

                setVisitorLoading(true);

                const response = await API.get(
                    `/visitors/stats?days=${visitorDays}`
                );

                if (response.data.success) {

                    setVisitorStats(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Visitor Stats Error:",
                    error
                );

            } finally {

                setVisitorLoading(false);

            }

        };

        fetchVisitorStats();

    }, [visitorDays]);

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                const token = localStorage.getItem("adminToken");

                if (!token) {
                    navigate("/admin/login");
                    return;
                }

                const response = await API.get(
                    "/admin/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setStats(response.data.data);
                }

            } catch (error) {

                console.error(
                    "Dashboard Stats Error:",
                    error
                );

                if (error.response?.status === 401) {

                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("admin");

                    navigate("/admin/login");
                }

            } finally {

                setLoading(false);

            }

        };


        const fetchRecentMessages = async () => {

            try {

                const response =
                    await API.get("/messages");

                if (response.data.success) {

                    // Latest 3 messages
                    setRecentMessages(
                        response.data.data.slice(0, 3)
                    );

                }

            } catch (error) {

                console.error(
                    "Recent Messages Error:",
                    error
                );

            }

        };


        fetchDashboardStats();
        fetchRecentMessages();

    }, [navigate]);




    const getCompleteVisitorStats = () => {
        const result = [];

        const today = new Date();

        for (let i = visitorDays - 1; i >= 0; i--) {

            const date = new Date(today);

            date.setDate(today.getDate() - i);

            const dateString =
                date.toISOString().split("T")[0];

            const existing =
                visitorStats.find(
                    (item) =>
                        String(item.visit_date).split("T")[0] === dateString
                );

            result.push({
                visit_date: dateString,
                visitors: existing
                    ? Number(existing.visitors)
                    : 0
            });
        }

        return result;
    };

    const completeVisitorStats =
        getCompleteVisitorStats();

    const maxVisitors = Math.max(
        ...completeVisitorStats.map(
            (item) => item.visitors
        ),
        1
    );

    return (
        <div className="admin-dashboard">

            <Sidebar
                unreadMessages={stats.unreadMessages}
                isMobileOpen={isMobileOpen}
                toggleSidebar={toggleSidebar}
                collapsed={sidebarCollapsed}
                toggleCollapsed={toggleSidebarCollapsed}
            />

            {/* ================= MAIN CONTENT ================= */}

            <main
                className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed-main" : ""
                    }`}
            >
                {/* Top Header */}

                <header className="admin-header">

                    <div className="header-left">



                        <button className="mobile-menu" onClick={toggleSidebar} aria-label="Toggle menu">
                            <FaBars />
                        </button>

                        <div className="search-box">

                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search something..."
                            />

                        </div>

                    </div>


                    <div className="header-right">


                        <button className="header-icon">
                            <FaBell />

                            {stats.unreadMessages > 0 && (
                                <span className="bell-badge">
                                    {stats.unreadMessages}
                                </span>
                            )}

                        </button>


                        <div className="admin-user">

                            <div className="admin-avatar">
                                {admin?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "H"}
                            </div>

                            <div className="admin-user-info">

                                <strong>
                                    {admin?.name || "Harshad"}
                                </strong>

                                <span>
                                    Administrator
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                {/* Dashboard Content */}

                <section className="dashboard-content">

                    {/* Welcome */}

                    <div className="dashboard-heading">

                        <div>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Welcome back, {admin?.name || "Harshad"}!
                                Here's what's happening with your portfolio.
                            </p>

                        </div>

                        <div className="date-box">
                            📅 &nbsp; Last 30 Days
                        </div>

                    </div>


                    {/* ================= STAT CARDS ================= */}

                    <div className="stats-grid">

                        {/* Projects */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon purple">
                                    <FaProjectDiagram />
                                </div>

                                <span className="growth">
                                    <FaArrowUp /> 12%
                                </span>

                            </div>

                            <h3>
                                {loading ? "..." : stats.projects}
                            </h3>
                            <p>
                                Total Projects
                            </p>

                            <div className="stat-footer">
                                +2 this month
                            </div>

                        </div>


                        {/* Skills */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon blue">
                                    <FaCode />
                                </div>

                                <span className="growth">
                                    <FaArrowUp /> 8%
                                </span>

                            </div>

                            <h3>
                                {loading ? "..." : stats.skills}
                            </h3>

                            <p>
                                Skills
                            </p>

                            <div className="stat-footer">
                                Total skills
                            </div>

                        </div>


                        {/* Experience */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon green">
                                    <FaBriefcase />
                                </div>

                                <span className="growth">
                                    <FaArrowUp /> 5%
                                </span>

                            </div>

                            <h3>
                                {loading ? "..." : stats.experience}
                            </h3>

                            <p>
                                Experience
                            </p>

                            <div className="stat-footer">
                                No change
                            </div>

                        </div>


                        {/* Messages */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon pink">
                                    <FaEnvelope />
                                </div>

                                <span className="growth">
                                    <FaArrowUp /> 15%
                                </span>

                            </div>

                            <h3>
                                {loading ? "..." : stats.messages}
                            </h3>

                            <p>
                                Messages
                            </p>

                            <div className="stat-footer">
                                +5 this month
                            </div>

                        </div>

                    </div>


                    {/* ================= SECOND ROW ================= */}

                    <div className="dashboard-grid">


                        {/* Website Analytics */}

                        <div className="dashboard-card analytics-card">

                            <div className="card-header">

                                <div>

                                    <h2>
                                        Website Visitors
                                    </h2>

                                    <p>
                                        Portfolio traffic overview
                                    </p>

                                </div>

                                <select
                                    value={visitorDays}
                                    onChange={(e) =>
                                        setVisitorDays(Number(e.target.value))
                                    }
                                >
                                    <option value={7}>
                                        Last 7 Days
                                    </option>


                                </select>

                            </div>


                            <div className="chart">

                                <div className="chart-line">

                                    {completeVisitorStats.map((item, index) => {

                                        const visitors = Number(item.visitors);

                                        const height =
                                            (visitors / maxVisitors) * 100;

                                        return (
                                            <div
                                                className="visitor-bar-wrapper"
                                                key={index}
                                            >

                                                <span className="visitor-count">
                                                    {visitors}
                                                </span>

                                                <span
                                                    className={`visitor-bar ${visitors === 0 ? "zero" : ""
                                                        }`}
                                                    style={{
                                                        height:
                                                            visitors === 0
                                                                ? "2px"
                                                                : `${Math.max(height, 8)}%`
                                                    }}
                                                />

                                            </div>
                                        );

                                    })}

                                </div>

                            </div>


                            <div className="chart-bottom">

                                {completeVisitorStats.map((item, index) => (

                                    <span key={index}>

                                        {new Date(
                                            item.visit_date + "T00:00:00"
                                        ).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short"
                                            }
                                        )}

                                    </span>

                                ))}

                            </div>

                        </div>


                        {/* Quick Actions */}

                        <div className="dashboard-card quick-card">

                            <div className="card-header">

                                <div>

                                    <h2>
                                        Quick Actions
                                    </h2>

                                    <p>
                                        Manage your portfolio
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/admin/projects")
                                }
                                className="quick-action"
                            >

                                <div className="quick-icon purple-bg">
                                    <FaPlus />
                                </div>

                                <span>
                                    Add New Project
                                </span>

                                <b>›</b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/skills")
                                }
                                className="quick-action"
                            >

                                <div className="quick-icon blue-bg">
                                    <FaCode />
                                </div>

                                <span>
                                    Add New Skill
                                </span>

                                <b>›</b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/experience")
                                }
                                className="quick-action"
                            >

                                <div className="quick-icon green-bg">
                                    <FaBriefcase />
                                </div>

                                <span>
                                    Add Experience
                                </span>

                                <b>›</b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/messages")
                                }
                                className="quick-action"
                            >

                                <div className="quick-icon pink-bg">
                                    <FaEnvelope />
                                </div>

                                <span>
                                    View Messages
                                </span>

                                <b>›</b>

                            </button>

                        </div>

                    </div>


                    {/* ================= RECENT MESSAGES ================= */}

                    <div className="dashboard-card messages-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Recent Messages
                                </h2>

                                <p>
                                    Latest messages from your portfolio
                                </p>

                            </div>

                            <button
                                className="view-all"
                                onClick={() =>
                                    navigate("/admin/messages")
                                }
                            >
                                View All Messages
                            </button>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentMessages.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "30px"
                                                }}
                                            >
                                                No messages yet.
                                            </td>

                                        </tr>

                                    ) : (

                                        recentMessages.map((message) => (

                                            <tr key={message.id}>

                                                <td>
                                                    {message.name}
                                                </td>

                                                <td>
                                                    {message.email}
                                                </td>

                                                <td>
                                                    {message.subject || "-"}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            message.status === "unread"
                                                                ? "status new"
                                                                : "status read"
                                                        }
                                                    >
                                                        {message.status === "unread"
                                                            ? "New"
                                                            : "Read"}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="table-action"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/messages`
                                                            )
                                                        }
                                                        title="View Message"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* Footer */}

                    <footer className="admin-footer">

                        © 2026 Harshad Shinde. All rights reserved.

                    </footer>

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;