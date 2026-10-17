import { useEffect, useState } from "react";

import API from "../services/api";

import "../css/JavaResourcesAdmin.css";

import Sidebar from "../components/Sidebar";

import { useNavigate } from "react-router-dom";

import { FaJava, FaPlus, FaEdit, FaTrash, FaBars, FaBell } from "react-icons/fa";

const initialForm = {

    title: "",

    description: "",

    category: "Java",

    resource_type: "Study Notes",

    is_published: true,

};

export default function JavaResourcesAdmin() {

    const [resources, setResources] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [pdf, setPdf] = useState(null);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const toggleSidebar = () => setIsMobileOpen((prev) => !prev);

    const toggleSidebarCollapsed = () => setSidebarCollapsed((prev) => !prev);

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [stats, setStats] = useState({

        projects: 0,

        skills: 0,

        experience: 0,

        messages: 0,

        unreadMessages: 0

    });

    const admin = (() => {
        try {
            return JSON.parse(localStorage.getItem("admin") || "null");
        } catch {
            return null;
        }
    })();

    const [showForm, setShowForm] = useState(false);


    const loadResources = async () => {

        try {

            const response = await API.get("/java-resources");

            setResources(response.data.data || []);

            setError("");

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to load resources. Check your admin login."

            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const token = localStorage.getItem("adminToken");

        if (!token) {

            navigate("/admin/login");

            return;

        }

        loadResources();

    }, [navigate]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: type === "checkbox" ? checked : value,

        }));

    };

    const resetForm = () => {

        setForm(initialForm);

        setPdf(null);

        setEditingId(null);

        const input = document.getElementById("jra-pdf");

        if (input) input.value = "";

    };

    const handleEdit = (resource) => {

        setEditingId(resource.id);

        setForm({

            title: resource.title || "",

            description: resource.description || "",

            category: resource.category || "Java",

            resource_type: resource.resource_type || "Study Notes",

            is_published:

                resource.is_published === true ||

                resource.is_published === 1,

        });

        setPdf(null);

        setError("");

        setMessage("");

        window.scrollTo({ top: 0, behavior: "smooth" });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setMessage("");

        if (!editingId && !pdf) {

            setError("Please select a PDF file.");

            return;

        }

        setLoading(true);

        try {


            const data = new FormData();

            data.append("title", form.title);
            data.append("description", form.description);
            data.append("category", form.category);
            data.append("resource_type", form.resource_type);
            data.append("is_published", form.is_published ? "1" : "0");

            if (pdf) {
                data.append("pdf", pdf);
            }

            if (editingId) {
                await API.put(
                    `/java-resources/admin/${editingId}`,
                    data
                );

                setMessage("Resource updated successfully!");
            } else {
                await API.post("/java-resources", data);

                setMessage("Resource added successfully!");
            }


            resetForm();

            await loadResources();

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to save resource."

            );

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (resource) => {

        if (!window.confirm(`Delete "${resource.title}"?`)) return;

        setError("");

        setMessage("");

        try {

            await API.delete(`/java-resources/admin/${resource.id}`);

            setMessage("Resource deleted successfully!");

            if (editingId === resource.id) resetForm();

            await loadResources();

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to delete resource."

            );

        }

    };

    return (

        <>

            {/* Top Header */}



            <div className="admin-skills-page jra-admin-page">

                <Sidebar

                    unreadMessages={stats.unreadMessages}

                    isMobileOpen={isMobileOpen}

                    toggleSidebar={toggleSidebar}

                    collapsed={sidebarCollapsed}

                    toggleCollapsed={toggleSidebarCollapsed}

                />

                <main

                    className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed-main" : ""

                        }`}

                >

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

                    <div className="admin-java-resources">
                        {message && (

                            <div className="jra-success">{message}</div>

                        )}

                        {error && (

                            <div className="jra-error">{error}</div>

                        )}

                        <div className="jra-action-bar">

                            <button

                                type="button"

                                className="jra-add-btn"

                                onClick={() => {

                                    resetForm();

                                    setShowForm((prev) => !prev);

                                }}

                            >

                                <FaPlus />

                                Add Resource

                            </button>

                        </div>

                        {showForm && (

                            <form

                                className="jra-form-card"

                                onSubmit={handleSubmit}

                            >

                                <h2>

                                    {editingId ? "Edit Resource" : "Add New Resource"}

                                </h2>

                                <div className="jra-form-grid">

                                    <div className="jra-form-group">

                                        <label htmlFor="jra-title">Title</label>

                                        <input

                                            id="jra-title"

                                            name="title"

                                            value={form.title}

                                            onChange={handleChange}

                                            maxLength={255}

                                            required

                                        />

                                    </div>

                                    <div className="jra-form-group">

                                        <label htmlFor="jra-category">Category</label>

                                        <select

                                            id="jra-category"

                                            name="category"

                                            value={form.category}

                                            onChange={handleChange}

                                        >

                                            <option value="Java">Java</option>

                                            <option value="Spring Boot">Spring Boot</option>

                                            <option value="DSA">DSA</option>

                                            <option value="Interview">Interview</option>

                                        </select>

                                    </div>

                                    <div className="jra-form-group">

                                        <label htmlFor="jra-type">Resource Type</label>

                                        <select

                                            id="jra-type"

                                            name="resource_type"

                                            value={form.resource_type}

                                            onChange={handleChange}

                                        >

                                            <option value="Study Notes">Study Notes</option>

                                            <option value="Interview Preparation">

                                                Interview Preparation

                                            </option>

                                            <option value="Practice Questions">

                                                Practice Questions

                                            </option>

                                            <option value="Roadmap">Roadmap</option>

                                        </select>

                                    </div>

                                    <div className="jra-form-group">

                                        <label htmlFor="jra-pdf">PDF File</label>

                                        <input

                                            id="jra-pdf"

                                            type="file"

                                            accept=".pdf,application/pdf"

                                            required={!editingId}

                                            onChange={(e) =>

                                                setPdf(e.target.files?.[0] || null)

                                            }

                                        />

                                        <small>PDF only. Maximum size: 10 MB.</small>

                                    </div>

                                    <div className="jra-form-group jra-full-width">

                                        <label htmlFor="jra-description">

                                            Description

                                        </label>

                                        <textarea

                                            id="jra-description"

                                            name="description"

                                            value={form.description}

                                            onChange={handleChange}

                                            rows={3}

                                        />

                                    </div>

                                </div>

                                <label className="jra-publish">

                                    <input

                                        type="checkbox"

                                        name="is_published"

                                        checked={form.is_published}

                                        onChange={handleChange}

                                    />

                                    Publish on Java Learning Hub

                                </label>

                                <div className="jra-form-actions">

                                    <button type="submit" disabled={loading}>

                                        {loading

                                            ? "Saving..."

                                            : editingId

                                                ? "Update Resource"

                                                : "Save Resource"}

                                    </button>

                                    <button

                                        type="button"

                                        className="jra-cancel-btn"

                                        onClick={resetForm}

                                    >

                                        Cancel

                                    </button>

                                </div>

                            </form>

                        )}

                        <section className="jra-table-card">

                            <div className="jra-table-header">

                                <h2>All Resources</h2>

                                <div className="available-badge">
                                    <span className="badge-dot"></span>
                                    <span>{resources.length} resources</span>
                                </div>

                            </div>

                            {loading ? (

                                <p className="jra-empty">Loading resources...</p>

                            ) : resources.length === 0 ? (

                                <p className="jra-empty">No resources found.</p>

                            ) : (

                                <div className="jra-table-wrapper">

                                    <table className="jra-table">

                                        <thead>

                                            <tr>

                                                <th>Resource</th>

                                                <th>Category</th>

                                                <th>Type</th>

                                                <th>Status</th>

                                                <th className="text-center">Actions</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {resources.map((resource) => (

                                                <tr key={resource.id}>

                                                    <td>

                                                        <div className="jra-resource-name">

                                                            <FaJava />

                                                            <div>

                                                                <strong>{resource.title}</strong>

                                                                <small>

                                                                    {resource.description}

                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>{resource.category}</td>

                                                    <td>{resource.resource_type}</td>

                                                    <td>

                                                        <span

                                                            className={

                                                                resource.is_published === true ||

                                                                    resource.is_published === 1

                                                                    ? "jra-status published"

                                                                    : "jra-status draft"

                                                            }

                                                        >

                                                            {resource.is_published === true ||

                                                                resource.is_published === 1

                                                                ? "Published"

                                                                : "Draft"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="jra-table-actions">

                                                            <a

                                                                href={resource.file_url}

                                                                target="_blank"

                                                                rel="noopener noreferrer"

                                                            >

                                                                View PDF

                                                            </a>

                                                            <button

                                                                type="button"

                                                                onClick={() => {

                                                                    handleEdit(resource);

                                                                    setShowForm(true);

                                                                }}

                                                            >

                                                                <FaEdit /> Edit

                                                            </button>

                                                            <button

                                                                type="button"

                                                                className="jra-delete-btn"

                                                                onClick={() =>

                                                                    handleDelete(resource)

                                                                }

                                                            >

                                                                <FaTrash /> Delete

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>
                    </div>


                </main>

            </div>

        </>

    );

}
