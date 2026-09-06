import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaBriefcase,
    FaBars,
    FaBell,
} from "react-icons/fa";

import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import "../css/AdminExperience.css";

const AdminExperience = () => {

    const navigate = useNavigate();

    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const admin = JSON.parse(
        localStorage.getItem("admin")
    );

    const [formData, setFormData] = useState({
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
        location: "",
        display_order: 0
    });

    // ===============================
    // FETCH EXPERIENCE
    // ===============================

    const fetchExperiences = async () => {

        try {

            const response =
                await API.get("/experience");

            if (response.data.success) {

                setExperiences(
                    response.data.data
                );

            }

        } catch (error) {

            console.error(
                "Fetch Experience Error:",
                error
            );

            toast.error("Failed to fetch experience");

        } finally {

            setLoading(false);

        }

    };

    // ===============================
    // FETCH UNREAD MESSAGES
    // ===============================

    const fetchUnreadMessages = async () => {

        try {

            const token = localStorage.getItem("adminToken");

            const response = await API.get("/messages", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {

                const unread = response.data.data.filter(
                    msg => msg.status === "unread"
                );

                setUnreadMessages(unread.length);

            }

        } catch (error) {

            console.error(
                "Fetch Messages Error:",
                error
            );

        }

    };

    // ===============================
    // INITIAL LOAD
    // ===============================

    useEffect(() => {

        const token =
            localStorage.getItem("adminToken");

        if (!token) {

            navigate("/admin/login");

            return;

        }

        fetchExperiences();
        fetchUnreadMessages();

    }, [navigate]);

    // ===============================
    // HANDLE INPUT
    // ===============================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

    };

    // ===============================
    // RESET FORM
    // ===============================

    const resetForm = () => {

        setFormData({
            job_title: "",
            company: "",
            description: "",
            start_date: "",
            end_date: "",
            is_current: false,
            location: "",
            display_order: 0
        });

        setEditingId(null);
        setShowForm(false);

    };

    // ===============================
    // ADD EXPERIENCE
    // ===============================

    const handleAddExperience = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.post(
                    "/experience",
                    {
                        ...formData,
                        display_order:
                            Number(
                                formData.display_order
                            )
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.success) {

                toast.success(
                    "Experience added successfully"
                );

                resetForm();
                fetchExperiences();

            }

        } catch (error) {

            console.error(
                "Add Experience Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to add experience"
            );

        }

    };

    // ===============================
    // EDIT EXPERIENCE
    // ===============================

    const handleEdit = (experience) => {

        setEditingId(experience.id);

        setFormData({
            job_title: experience.job_title || "",
            company: experience.company || "",
            description: experience.description || "",
            start_date: experience.start_date
                ? experience.start_date.substring(0, 10)
                : "",
            end_date: experience.end_date
                ? experience.end_date.substring(0, 10)
                : "",
            is_current: Boolean(experience.is_current),
            location: experience.location || "",
            display_order: experience.display_order || 0
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // ===============================
    // UPDATE EXPERIENCE
    // ===============================

    const handleUpdateExperience = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.put(
                    `/experience/${editingId}`,
                    {
                        ...formData,
                        display_order:
                            Number(
                                formData.display_order
                            )
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.success) {

                toast.success(
                    "Experience updated successfully"
                );

                resetForm();
                fetchExperiences();

            }

        } catch (error) {

            console.error(
                "Update Experience Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update experience"
            );

        }

    };

    // ===============================
    // CONFIRM DELETE
    // ===============================

    const confirmDelete = (id) => {
        setDeleteModal({
            isOpen: true,
            id: id
        });
    };

    // ===============================
    // DELETE EXPERIENCE
    // ===============================

    const handleDelete = async () => {

        const id = deleteModal.id;

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.delete(
                    `/experience/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.success) {

                toast.success(
                    "Experience deleted successfully"
                );

                fetchExperiences();

            }

        } catch (error) {

            console.error(
                "Delete Experience Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete experience"
            );

        } finally {

            setDeleteModal({
                isOpen: false,
                id: null
            });

        }

    };

    // ===============================
    // CLOSE DELETE MODAL
    // ===============================

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            id: null
        });
    };

    // ===============================
    // UI
    // ===============================

    return (

        <div className="admin-experience-page">

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
                            <h1>Experience</h1>
                            <p>Manage your professional experience</p>
                        </div>
                        <div className="date-box">
                            <FaBriefcase />
                            <span>{experiences.length} Records</span>
                        </div>
                    </div>

                    {/* Add Button */}

                    <div className="action-bar">
                        <button
                            className="add-experience-btn"
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                        >
                            <FaPlus />
                            {showForm ? "Close Form" : "Add Experience"}
                        </button>
                    </div>

                    {/* Form */}

                    {showForm && (

                        <div className="experience-form-card">

                            <h2>
                                {editingId ? "Edit Experience" : "Add New Experience"}
                            </h2>

                            <form
                                onSubmit={
                                    editingId
                                        ? handleUpdateExperience
                                        : handleAddExperience
                                }
                            >

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Job Title *</label>
                                        <input
                                            type="text"
                                            name="job_title"
                                            value={formData.job_title}
                                            onChange={handleChange}
                                            placeholder="e.g. Java Full Stack Developer"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="e.g. Kiran Academy"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            disabled={formData.is_current}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Pune, Maharashtra"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Display Order</label>
                                        <input
                                            type="number"
                                            name="display_order"
                                            value={formData.display_order}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>

                                </div>

                                {/* Current Job Checkbox */}

                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="is_current"
                                        name="is_current"
                                        checked={formData.is_current}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="is_current">
                                        I currently work here
                                    </label>
                                </div>

                                {/* Description */}

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe your role, responsibilities and achievements..."
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-btn">
                                        {editingId ? "Update Experience" : "Save Experience"}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>

                        </div>

                    )}

                    {/* Experience List */}

                    <div className="experience-card">

                        <div className="experience-card-header">
                            <h2>All Experience</h2>
                            <span className="experience-count">
                                {experiences.length} Records
                            </span>
                        </div>

                        {loading ? (

                            <div className="loading">Loading experience...</div>

                        ) : experiences.length === 0 ? (

                            <div className="empty-state">
                                <FaBriefcase />
                                <h3>No Experience Found</h3>
                                <p>Add your first experience.</p>
                            </div>

                        ) : (

                            <div className="experience-table-wrapper">

                                <table className="experience-table">

                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Duration</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {experiences.map((experience) => (

                                            <tr key={experience.id}>

                                                <td>
                                                    <div className="experience-info">
                                                        <div className="experience-icon">
                                                            <FaBriefcase />
                                                        </div>
                                                        <strong>{experience.job_title}</strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    {experience.company || "-"}
                                                </td>

                                                <td>
                                                    {experience.start_date
                                                        ? experience.start_date.substring(0, 10)
                                                        : "-"}
                                                    {" - "}
                                                    {experience.is_current
                                                        ? "Present"
                                                        : experience.end_date
                                                            ? experience.end_date.substring(0, 10)
                                                            : "-"}
                                                </td>

                                                <td>
                                                    {experience.location || "-"}
                                                </td>

                                                <td>
                                                    {experience.is_current ? (
                                                        <span className="current-badge">Current</span>
                                                    ) : (
                                                        <span className="past-badge">Completed</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(experience)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => confirmDelete(experience.id)}
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

                        )}

                    </div>

                    {/* Footer */}

                    <footer className="admin-footer">
                        © 2026 Harshad Shinde. All rights reserved.
                    </footer>

                </section>

            </main>

            {/* Delete Confirmation Modal */}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Delete Experience"
                message="Are you sure you want to delete this experience? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

        </div>

    );

};

export default AdminExperience;