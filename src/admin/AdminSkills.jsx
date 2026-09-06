import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCode,
    FaBars,
    FaBell,
} from "react-icons/fa";

import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import "../css/AdminSkills.css";

const AdminSkills = () => {

    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
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
        name: "",
        category: "",
        proficiency: 0,
        icon: "",
        display_order: 0
    });

    // ===============================
    // FETCH SKILLS
    // ===============================

    const fetchSkills = async () => {

        try {

            const response =
                await API.get("/skills");

            if (response.data.success) {

                setSkills(
                    response.data.data
                );

            }

        } catch (error) {

            console.error(
                "Fetch Skills Error:",
                error
            );

            toast.error("Failed to fetch skills");

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

        fetchSkills();
        fetchUnreadMessages();

    }, [navigate]);

    // ===============================
    // HANDLE INPUT
    // ===============================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    // ===============================
    // RESET FORM
    // ===============================

    const resetForm = () => {

        setFormData({
            name: "",
            category: "",
            proficiency: 0,
            icon: "",
            display_order: 0
        });

        setEditingId(null);
        setShowForm(false);

    };

    // ===============================
    // ADD SKILL
    // ===============================

    const handleAddSkill = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.post(
                    "/skills",
                    {
                        ...formData,
                        proficiency:
                            Number(
                                formData.proficiency
                            ),
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

                toast.success("Skill added successfully");

                resetForm();
                fetchSkills();

            }

        } catch (error) {

            console.error(
                "Add Skill Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to add skill"
            );

        }

    };

    // ===============================
    // EDIT SKILL
    // ===============================

    const handleEdit = (skill) => {

        setEditingId(skill.id);

        setFormData({
            name: skill.name || "",
            category: skill.category || "",
            proficiency: skill.proficiency || 0,
            icon: skill.icon || "",
            display_order: skill.display_order || 0
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // ===============================
    // UPDATE SKILL
    // ===============================

    const handleUpdateSkill = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.put(
                    `/skills/${editingId}`,
                    {
                        ...formData,
                        proficiency:
                            Number(
                                formData.proficiency
                            ),
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

                toast.success("Skill updated successfully");

                resetForm();
                fetchSkills();

            }

        } catch (error) {

            console.error(
                "Update Skill Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update skill"
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
    // CLOSE DELETE MODAL
    // ===============================

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            id: null
        });
    };

    // ===============================
    // DELETE SKILL
    // ===============================

    const handleDelete = async () => {

        const id = deleteModal.id;

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await API.delete(
                    `/skills/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.success) {

                toast.success("Skill deleted successfully");

                fetchSkills();

            }

        } catch (error) {

            console.error(
                "Delete Skill Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete skill"
            );

        } finally {

            setDeleteModal({
                isOpen: false,
                id: null
            });

        }

    };

    // ===============================
    // UI
    // ===============================

    return (

        <div className="admin-skills-page">

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
                            <h1>Skills</h1>
                            <p>Manage your technical skills</p>
                        </div>
                        <div className="date-box">
                            <FaCode />
                            <span>{skills.length} Skills</span>
                        </div>
                    </div>

                    {/* Add Button */}

                    <div className="action-bar">
                        <button
                            className="add-skill-btn"
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                        >
                            <FaPlus />
                            {showForm ? "Close Form" : "Add Skill"}
                        </button>
                    </div>

                    {/* Form */}

                    {showForm && (

                        <div className="skill-form-card">

                            <h2>
                                {editingId ? "Edit Skill" : "Add New Skill"}
                            </h2>

                            <form
                                onSubmit={
                                    editingId
                                        ? handleUpdateSkill
                                        : handleAddSkill
                                }
                            >

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Skill Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Java"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            <option value="Frontend">
                                                Frontend
                                            </option>
                                            <option value="Backend">
                                                Backend
                                            </option>
                                            <option value="Database">
                                                Database
                                            </option>
                                            <option value="Programming">
                                                Programming
                                            </option>
                                            <option value="Tools">
                                                Tools
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Proficiency (%)</label>
                                        <input
                                            type="number"
                                            name="proficiency"
                                            value={formData.proficiency}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Icon Name</label>
                                        <input
                                            type="text"
                                            name="icon"
                                            value={formData.icon}
                                            onChange={handleChange}
                                            placeholder="e.g. FaJava"
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

                                <div className="form-actions">
                                    <button type="submit" className="save-btn">
                                        {editingId ? "Update Skill" : "Save Skill"}
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

                    {/* Skills List */}

                    <div className="skills-card">

                        <div className="skills-card-header">
                            <h2>All Skills</h2>
                            <span className="skill-count">
                                {skills.length} Skills
                            </span>
                        </div>

                        {loading ? (

                            <div className="loading">Loading skills...</div>

                        ) : skills.length === 0 ? (

                            <div className="empty-state">
                                <FaCode />
                                <h3>No Skills Found</h3>
                                <p>Add your first technical skill.</p>
                            </div>

                        ) : (

                            <div className="skills-table-wrapper">

                                <table className="skills-table">

                                    <thead>
                                        <tr>
                                            <th>Skill</th>
                                            <th>Category</th>
                                            <th>Proficiency</th>
                                            <th>Order</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {skills.map((skill) => (

                                            <tr key={skill.id}>

                                                <td>
                                                    <div className="skill-info">

                                                        <strong>{skill.name}</strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="category-badge">
                                                        {skill.category || "General"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="proficiency-wrapper">
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{
                                                                    width: `${skill.proficiency}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span>{skill.proficiency}%</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {skill.display_order}
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(skill)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => confirmDelete(skill.id)}
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
                title="Delete Skill"
                message="Are you sure you want to delete this skill? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

        </div>

    );

};

export default AdminSkills;