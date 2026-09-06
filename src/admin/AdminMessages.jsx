import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";

import {
    FaBars,
    FaBell,
    FaEnvelope,
    FaCheck,
    FaTrash,
    FaSync,
    FaEnvelopeOpen,
} from "react-icons/fa";

import "../css/AdminMessages.css";

const AdminMessages = () => {

    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: null
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const toggleSidebarCollapsed = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    const [selectedMessage, setSelectedMessage] = useState(null);

    const admin = JSON.parse(
        localStorage.getItem("admin")
    );

    const fetchMessages = async () => {

        try {

            const response = await API.get("/messages");

            if (response.data.success) {
                setMessages(response.data.data);

                const unread = response.data.data.filter(
                    msg => msg.status === "unread"
                );
                setUnreadMessages(unread.length);
            }

        } catch (err) {

            console.error(
                "Failed to fetch messages:",
                err
            );

            setError("Unable to load messages.");
            toast.error("Failed to load messages");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // ==============================
    // MARK AS READ
    // ==============================

    const markAsRead = async (id) => {

        try {

            await API.put(
                `/messages/${id}/read`
            );

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === id
                        ? {
                            ...msg,
                            status: "read"
                        }
                        : msg
                )
            );

            setUnreadMessages((prev) => Math.max(0, prev - 1));

            toast.success("Message marked as read");

        } catch (err) {

            console.error(
                "Mark as read error:",
                err
            );

            toast.error("Failed to mark message as read");

        }
    };


    const handleMessageClick = async (msg) => {
        setSelectedMessage(msg);

        // Mark as read if unread
        if (msg.status === "unread") {
            await markAsRead(msg.id);

            // Update selected message also
            setSelectedMessage({
                ...msg,
                status: "read"
            });
        }
    };

    // ==============================
    // CONFIRM DELETE
    // ==============================

    const confirmDelete = (id) => {
        setDeleteModal({
            isOpen: true,
            id: id
        });
    };

    // ==============================
    // CLOSE DELETE MODAL
    // ==============================

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            id: null
        });
    };

    // ==============================
    // DELETE
    // ==============================

    const handleDelete = async () => {

        const id = deleteModal.id;

        try {

            const msg = messages.find(m => m.id === id);

            await API.delete(
                `/messages/${id}`
            );

            setMessages((prev) =>
                prev.filter(
                    (msg) => msg.id !== id
                )
            );

            if (msg && msg.status === "unread") {
                setUnreadMessages((prev) => Math.max(0, prev - 1));
            }

            toast.success("Message deleted successfully");

        } catch (err) {

            console.error(
                "Delete message error:",
                err
            );

            toast.error("Failed to delete message");

        } finally {

            setDeleteModal({
                isOpen: false,
                id: null
            });

        }
    };

    // ==============================
    // REFRESH MESSAGES
    // ==============================

    const handleRefresh = async () => {

        setLoading(true);
        await fetchMessages();
        toast.info("Messages refreshed");

    };

    if (loading) {

        return (
            <div className="admin-messages-page">
                <Sidebar unreadMessages={unreadMessages} />
                <main className="admin-main">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                </main>
            </div>
        );

    }

    return (

        <div className="admin-messages-page">

            <Sidebar
                unreadMessages={unreadMessages}
                isMobileOpen={isMobileOpen}
                toggleSidebar={toggleSidebar}
                collapsed={sidebarCollapsed}
                toggleCollapsed={toggleSidebarCollapsed}
            />

            <main
                className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed-main" : ""
                    }`}
            >

                {/* Header */}

                <header className="admin-header">

                    <div className="header-left">

                        <button
                            className="mobile-menu"
                            onClick={toggleSidebar}
                            aria-label="Toggle menu"
                        >
                            <FaBars />
                        </button>

                        <div className="search-box">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search..."
                            />
                        </div>

                    </div>

                    <div className="header-right">

                        <button className="header-icon">
                            <FaBell />
                            {unreadMessages > 0 && (
                                <span className="bell-badge">
                                    {unreadMessages}
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

                {/* Content */}

                <section className="dashboard-content">

                    {/* Heading */}

                    <div className="dashboard-heading">
                        <div>
                            <h1>Messages</h1>
                            <p>Messages received from your portfolio visitors</p>
                        </div>
                        <div className="date-box">
                            <FaEnvelope />
                            <span>{messages.length} Messages</span>
                            {unreadMessages > 0 && (
                                <span className="unread-count">
                                    {unreadMessages} Unread
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Refresh Button */}

                    <div className="action-bar">
                        <button
                            className="refresh-btn"
                            onClick={handleRefresh}
                        >
                            <FaSync />
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {/* Messages List */}

                    {messages.length === 0 ? (

                        <div className="messages-card empty">
                            <div className="empty-state">
                                <FaEnvelopeOpen />
                                <h3>No messages yet</h3>
                                <p>Messages submitted through your Contact Us form will appear here.</p>
                            </div>
                        </div>

                    ) : (

                        <div className="messages-card">

                            <div className="messages-card-header">
                                <h2>All Messages</h2>
                                <span className="message-count">
                                    {messages.length} Messages
                                </span>
                            </div>

                            <div className="messages-table-wrapper">

                                <table className="messages-table">

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {messages.map((msg, index) => (

                                            <tr
                                                key={msg.id}
                                                className={msg.status === "unread" ? "unread-row" : ""}
                                            >

                                                <td>{index + 1}</td>

                                                <td>
                                                    <div className="message-info">
                                                        <div className="message-icon">
                                                            <FaEnvelope />
                                                        </div>
                                                        <strong>{msg.name}</strong>
                                                    </div>
                                                </td>

                                                <td>{msg.email}</td>

                                                <td>{msg.subject || "-"}</td>

                                                <td
                                                    className="message-text clickable-message"
                                                    onClick={() => handleMessageClick(msg)}
                                                    title="Click to view message"
                                                >
                                                    {msg.message}
                                                </td>

                                                <td>
                                                    {msg.status === "unread" ? (
                                                        <span className="status-badge unread">Unread</span>
                                                    ) : (
                                                        <span className="status-badge read">Read</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        msg.created_at
                                                    ).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        {msg.status === "unread" && (
                                                            <button
                                                                className="read-btn"
                                                                onClick={() => markAsRead(msg.id)}
                                                                title="Mark as read"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => confirmDelete(msg.id)}
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                    {/* Footer */}

                    <footer className="admin-footer">
                        © 2026 Harshad Shinde. All rights reserved.
                    </footer>

                </section>

            </main>

            {/* Message Details Modal */}
            {selectedMessage && (
                <div
                    className="message-modal-overlay"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        className="message-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="message-modal-header">
                            <div>
                                <h2>Message Details</h2>
                                <p>Message received from your portfolio visitor</p>
                            </div>

                            <button
                                className="message-modal-close"
                                onClick={() => setSelectedMessage(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="message-modal-body">

                            <div className="message-detail-row">
                                <span>Name</span>
                                <strong>{selectedMessage.name}</strong>
                            </div>

                            <div className="message-detail-row">
                                <span>Email</span>
                                <strong>{selectedMessage.email}</strong>
                            </div>

                            <div className="message-detail-row">
                                <span>Subject</span>
                                <strong>
                                    {selectedMessage.subject || "-"}
                                </strong>
                            </div>

                            <div className="message-detail-row">
                                <span>Date</span>
                                <strong>
                                    {new Date(
                                        selectedMessage.created_at
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </strong>
                            </div>

                            <div className="message-detail-message">
                                <span>Message</span>

                                <div className="full-message">
                                    {selectedMessage.message}
                                </div>
                            </div>

                        </div>

                        <div className="message-modal-footer">
                            <button
                                className="close-message-btn"
                                onClick={() => setSelectedMessage(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

        </div>

    );

};

export default AdminMessages;