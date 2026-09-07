import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaGithub,
    FaExternalLinkAlt,
    FaProjectDiagram,
    FaBars,
    FaBell,
} from "react-icons/fa";

import API from "../services/api";
import { SERVER_URL } from "../services/appConfig";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import "../css/AdminProjects.css";

const AdminProjects = () => {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
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

    const initialFormData = {
        title: "",
        category: "",
        description: "",
        image: null,
        github_url: "",
        demo_url: "",
        featured: false,
        display_order: 0,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [imagePreview, setImagePreview] = useState("");

    // =================================
    // FETCH PROJECTS
    // =================================

    const fetchProjects = async () => {

        try {

            const response = await API.get("/projects");

            if (response.data.success) {

                setProjects(response.data.data);

            }

        } catch (error) {

            console.error(
                "Fetch Projects Error:",
                error
            );

            toast.error("Failed to fetch projects");

        } finally {

            setLoading(false);

        }

    };

    // =================================
    // FETCH UNREAD MESSAGES COUNT
    // =================================

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

    useEffect(() => {

        fetchProjects();
        fetchUnreadMessages();

    }, []);

    // =================================
    // INPUT CHANGE
    // =================================

    const handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;

        if (type === "file") {

            const file = files?.[0];

            if (!file) return;

            setFormData(prev => ({
                ...prev,
                [name]: file
            }));

            setImagePreview(
                getImageUrl(project.image)
            );

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value
        }));
    };

    const buildFormData = () => {

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {

            if (key === "image") {

                if (value instanceof File) {
                    data.append("image", value);
                }

                return;
            }

            data.append(key, value);
        });

        return data;
    };

    const getImageUrl = (image) => {
        if (!image) return "";

        const fixedImage = image.replace(/^https\/\//, "https://");

        if (
            fixedImage.startsWith("https://") ||
            fixedImage.startsWith("http://")
        ) {
            return fixedImage;
        }

        return `${SERVER_URL}${fixedImage}`;
    };


    // =================================
    // RESET FORM
    // =================================

    const resetForm = () => {

        setFormData(initialFormData);

        setImagePreview("");

        setEditingId(null);

        setShowForm(false);
    };

    // =================================
    // ADD PROJECT
    // =================================

    const getAuthConfig = () => {
        const token =
            localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const handleAddProject = async (e) => {

        e.preventDefault();

        try {

            const data = buildFormData();

            console.log(
                "========== FRONTEND FORM DATA =========="
            );

            for (const [key, value] of data.entries()) {

                console.log(
                    key,
                    value instanceof File
                        ? {
                            name: value.name,
                            type: value.type,
                            size: value.size
                        }
                        : value
                );
            }

            const token =
                localStorage.getItem("adminToken");

            const response = await API.post(
                "/projects",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Response:",
                response.data
            );

            if (response.data.success) {

                toast.success(
                    "Project added successfully"
                );

                resetForm();

                fetchProjects();
            }

        } catch (error) {

            console.error(
                "Add Project Error:",
                error
            );

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "SERVER RESPONSE:",
                error.response?.data
            );
        }
    };

    // =================================
    // EDIT PROJECT
    // =================================

    const handleEdit = (project) => {

        setEditingId(project.id);

        setFormData({
            title: project.title || "",
            category: project.category || "",
            description: project.description || "",
            image: null,
            github_url: project.github_url || "",
            demo_url: project.demo_url || "",
            featured: Boolean(project.featured),
            display_order: project.display_order || 0
        });

        setImagePreview(
            project.image
                ? project.image.startsWith("http")
                    ? project.image
                    : `${SERVER_URL}${project.image}`
                : ""
        );

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =================================
    // UPDATE PROJECT
    // =================================

    const handleUpdateProject = async (e) => {

        e.preventDefault();

        try {

            const data = buildFormData();

            const token =
                localStorage.getItem("adminToken");

            const response = await API.put(
                `/projects/${editingId}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {

                throw new Error(
                    response.data.message
                );
            }

            toast.success(
                "Project updated successfully"
            );

            resetForm();

            fetchProjects();

        } catch (error) {

            console.error(
                "Update Project Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update project"
            );
        }
    };

    // =================================
    // CONFIRM DELETE
    // =================================

    const confirmDelete = (id) => {
        setDeleteModal({
            isOpen: true,
            id: id
        });
    };

    // =================================
    // CLOSE DELETE MODAL
    // =================================

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            id: null
        });
    };

    // =================================
    // DELETE PROJECT
    // =================================

    const handleDelete = async () => {

        const id = deleteModal.id;

        try {

            const token =
                localStorage.getItem("adminToken");

            const response = await API.delete(
                `/projects/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {

                toast.success("Project deleted successfully");

                fetchProjects();

            }

        } catch (error) {

            console.error(
                "Delete Project Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete project"
            );

        } finally {

            setDeleteModal({
                isOpen: false,
                id: null
            });

        }

    };

    return (

        <div className="admin-projects-page">

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
                            <h1>Projects</h1>
                            <p>Manage your portfolio projects</p>
                        </div>
                        <div className="date-box">
                            <FaProjectDiagram />
                            <span>{projects.length} Projects</span>
                        </div>
                    </div>

                    {/* Add Button */}

                    <div className="action-bar">
                        <button
                            className="add-project-btn"
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                        >
                            <FaPlus />
                            {showForm ? "Close Form" : "Add Project"}
                        </button>
                    </div>

                    {/* Form */}

                    {showForm && (

                        <div className="project-form-card">

                            <h2>
                                {editingId ? "Edit Project" : "Add New Project"}
                            </h2>

                            <form
                                onSubmit={
                                    editingId
                                        ? handleUpdateProject
                                        : handleAddProject
                                }
                            >

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Project Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter project title"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="e.g. Full Stack"
                                        />
                                    </div>

                                    <div className="form-group">

                                        <label>Project Image</label>

                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleChange}
                                        />

                                        {imagePreview && (
                                            <div className="image-preview">
                                                <img
                                                    src={imagePreview}
                                                    alt="Project preview"
                                                />
                                            </div>
                                        )}

                                    </div>



                                    <div className="form-group">
                                        <label>GitHub URL</label>
                                        <input
                                            type="url"
                                            name="github_url"
                                            value={formData.github_url}
                                            onChange={handleChange}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Live Demo URL</label>
                                        <input
                                            type="url"
                                            name="demo_url"
                                            value={formData.demo_url}
                                            onChange={handleChange}
                                            placeholder="https://..."
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

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe your project..."
                                    />
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="featured-checkbox">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                        />
                                        Featured Project
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-btn">
                                        {editingId ? "Update Project" : "Save Project"}
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

                    {/* Projects List */}

                    <div className="projects-card">

                        <div className="projects-card-header">
                            <h2>All Projects</h2>
                            <span className="project-count">
                                {projects.length} Projects
                            </span>
                        </div>

                        {loading ? (

                            <div className="loading">Loading projects...</div>

                        ) : projects.length === 0 ? (

                            <div className="empty-state">
                                <FaProjectDiagram />
                                <h3>No Projects Found</h3>
                                <p>Add your first project to your portfolio.</p>
                            </div>

                        ) : (

                            <div className="projects-table-wrapper">

                                <table className="projects-table">

                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Category</th>
                                            <th>Featured</th>
                                            <th>Links</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {projects.map((project) => (

                                            <tr key={project.id}>

                                                <td>
                                                    <div className="project-info">
                                                        {project.image ? (
                                                            <img
                                                                src={getImageUrl(project.image)}
                                                                alt={project.title}
                                                            />
                                                        ) : (
                                                            <div className="project-placeholder">
                                                                <FaProjectDiagram />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <strong>{project.title}</strong>
                                                            <small>{project.description}</small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="category-badge">
                                                        {project.category || "General"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {project.featured ? (
                                                        <span className="featured-badge">Featured</span>
                                                    ) : (
                                                        <span className="normal-badge">Regular</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="project-links">
                                                        {project.github_url && (
                                                            <a
                                                                href={project.github_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="GitHub"
                                                            >
                                                                <FaGithub />
                                                            </a>
                                                        )}
                                                        {project.demo_url && (
                                                            <a
                                                                href={project.demo_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="Live Demo"
                                                            >
                                                                <FaExternalLinkAlt />
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(project)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => confirmDelete(project.id)}
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
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

        </div>

    );

};

export default AdminProjects;