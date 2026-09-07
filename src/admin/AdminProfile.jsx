import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { SERVER_URL } from "../services/appConfig";

import {
    FaBars,
    FaBell,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGlobe,
    FaGithub,
    FaLinkedin,
    FaFileAlt,
    FaSave,
    FaSpinner,
} from "react-icons/fa";

import "../css/AdminProfile.css";

const AdminProfile = () => {

    const navigate = useNavigate();

    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [resumeMessage, setResumeMessage] = useState("");

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
    const [profileImageMessage, setProfileImageMessage] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        title: "",
        bio: "",
        location: "",
        email: "",
        phone: "",
        availability: "",
        profile_image: "",
        github_url: "",
        linkedin_url: "",
        resume_url: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

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

    // ===============================
    // FETCH PROFILE
    // ===============================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await API.get("/profile");

                if (response.data.success) {

                    setProfile(response.data.data);

                }

            } catch (err) {

                console.error(
                    "Failed to fetch profile:",
                    err
                );

                toast.error("Failed to load profile.");

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    // ===============================
    // FETCH UNREAD MESSAGES
    // ===============================

    useEffect(() => {

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

        fetchUnreadMessages();

    }, []);

    // ===============================
    // HANDLE INPUT
    // ===============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    // ===============================
    // UPDATE PROFILE
    // ===============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const response =
                await API.put(
                    "/profile",
                    profile
                );

            if (response.data.success) {

                toast.success("Profile updated successfully!");

                // Update admin name in localStorage
                const adminData = JSON.parse(
                    localStorage.getItem("admin")
                );

                if (adminData) {
                    adminData.name = profile.name;
                    localStorage.setItem(
                        "admin",
                        JSON.stringify(adminData)
                    );
                }

            }

        } catch (err) {

            console.error(
                "Update Profile Error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);

        }

    };

    const handleResumeChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {

            setResumeMessage("Only PDF files are allowed.");
            setResumeFile(null);

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            setResumeMessage("Resume must be less than 5 MB.");
            setResumeFile(null);

            return;
        }

        setResumeFile(file);
        setResumeMessage("");
    };

    const handleResumeUpload = async () => {

        if (!resumeFile) {

            setResumeMessage(
                "Please select a resume PDF first."
            );

            return;
        }

        try {

            setUploadingResume(true);
            setResumeMessage("");

            const formData = new FormData();

            formData.append("resume", resumeFile);

            const response = await API.post(
                "/profile/resume",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResumeMessage(
                response.data.message ||
                "Resume uploaded successfully."
            );

            setResumeFile(null);

            // Refresh profile data
            const profileResponse =
                await API.get("/profile");

            setProfile(profileResponse.data.data);

        } catch (error) {

            console.error(
                "Resume Upload Error:",
                error
            );

            setResumeMessage(
                error.response?.data?.message ||
                "Failed to upload resume."
            );

        } finally {

            setUploadingResume(false);

        }
    };

    const handleProfileImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            setProfileImageMessage(
                "Only JPG, PNG and WEBP images are allowed."
            );

            setProfileImageFile(null);

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            setProfileImageMessage(
                "Profile image must be less than 5 MB."
            );

            setProfileImageFile(null);

            return;
        }

        setProfileImageFile(file);
        setProfileImageMessage("");
    };

    const handleProfileImageUpload = async () => {

        if (!profileImageFile) {

            setProfileImageMessage(
                "Please select a profile image first."
            );

            return;
        }

        try {

            setUploadingProfileImage(true);
            setProfileImageMessage("");

            const formData = new FormData();

            formData.append(
                "image",
                profileImageFile
            );

            const response = await API.post(
                "/profile/image",
                formData
            );

            if (response.data.success) {

                setProfileImageMessage(
                    "Profile image uploaded successfully."
                );

                setProfileImageFile(null);

                // Refresh profile
                const profileResponse =
                    await API.get("/profile");

                setProfile(
                    profileResponse.data.data
                );
            }

        } catch (error) {

            console.error(
                "Profile Image Upload Error:",
                error
            );

            setProfileImageMessage(
                error.response?.data?.message ||
                "Failed to upload profile image."
            );

        } finally {

            setUploadingProfileImage(false);
        }
    };

    if (loading) {

        return (
            <div className="admin-profile-page">
                <Sidebar unreadMessages={unreadMessages} />
                <main className="admin-main">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading profile...</p>
                    </div>
                </main>
            </div>
        );

    }

    return (

        <div className="admin-profile-page">

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
                            <h1>Profile</h1>
                            <p>Manage your portfolio information</p>
                        </div>

                    </div>

                    {/* Profile Form */}

                    <div className="profile-card">

                        <form onSubmit={handleSubmit}>

                            {/* Basic Information */}

                            <div className="profile-section">

                                <h3 className="section-title">
                                    Basic Information
                                </h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Professional Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={profile.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Full Stack Developer"
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Bio</label>
                                        <textarea
                                            name="bio"
                                            rows="4"
                                            value={profile.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Contact Information */}

                            <div className="profile-section">

                                <h3 className="section-title">
                                    Contact Information
                                </h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            <FaMapMarkerAlt /> Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={profile.location || ""}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai, India"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FaEnvelope /> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email || ""}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FaPhone /> Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profile.phone || ""}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FaGlobe /> Availability
                                        </label>
                                        <input
                                            type="text"
                                            name="availability"
                                            value={profile.availability || ""}
                                            onChange={handleChange}
                                            placeholder="e.g. Available for work"
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className="resume-upload-card">

                                <div className="resume-upload-header">

                                    <div>
                                        <h3>Resume</h3>

                                        <p>
                                            Upload your latest resume PDF.
                                        </p>
                                    </div>

                                    <i className="fas fa-file-pdf"></i>

                                </div>


                                {/* Current Resume */}

                                {profile?.resume_url && (

                                    <div className="current-resume">

                                        <span>
                                            Current Resume
                                        </span>

                                        <a
                                            href={
                                                profile.resume_url?.startsWith("http")
                                                    ? profile.resume_url
                                                    : `${SERVER_URL}${profile.resume_url}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fas fa-eye"></i>
                                            View Resume
                                        </a>

                                    </div>

                                )}


                                {/* File Input */}

                                <div className="resume-file-input">

                                    <input
                                        type="file"
                                        id="resumeFile"
                                        accept="application/pdf"
                                        onChange={handleResumeChange}
                                    />

                                    <label htmlFor="resumeFile">

                                        <i className="fas fa-cloud-arrow-up"></i>

                                        <span>
                                            {resumeFile
                                                ? resumeFile.name
                                                : "Choose Resume PDF"}
                                        </span>

                                    </label>

                                </div>


                                {/* Upload Button */}

                                <button
                                    type="button"
                                    className="resume-upload-btn"
                                    onClick={handleResumeUpload}
                                    disabled={uploadingResume}
                                >

                                    <i
                                        className={
                                            uploadingResume
                                                ? "fas fa-spinner fa-spin"
                                                : "fas fa-upload"
                                        }
                                    ></i>

                                    {uploadingResume
                                        ? "Uploading..."
                                        : "Upload Resume"}

                                </button>


                                {/* Message */}

                                {resumeMessage && (

                                    <div className="resume-message">

                                        <i className="fas fa-circle-info"></i>

                                        {resumeMessage}

                                    </div>

                                )}

                            </div>

                            {/* Social Links */}

                            <div className="profile-section">

                                <h3 className="section-title">
                                    Social & Resume
                                </h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            <FaGithub /> GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            name="github_url"
                                            value={profile.github_url || ""}
                                            onChange={handleChange}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FaLinkedin /> LinkedIn URL
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin_url"
                                            value={profile.linkedin_url || ""}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>
                                            <FaFileAlt /> Resume URL
                                        </label>
                                        <input
                                            type="text"
                                            name="resume_url"
                                            value={profile.resume_url || ""}
                                            onChange={handleChange}
                                            placeholder="/resume/harshad.pdf"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Profile Image */}

                            {/* Profile Image */}

                            <div className="profile-section">

                                <h3 className="section-title">
                                    Profile Image
                                </h3>

                                <div className="profile-image-upload">

                                    {/* Current Image */}

                                    {profile.profile_image && (
                                        <div className="profile-image-preview">

                                            <img
                                                src={`${SERVER_URL}${profile.profile_image}`}
                                                alt="Profile"
                                            />

                                            <p>
                                                Current profile image
                                            </p>

                                        </div>
                                    )}

                                    {/* File Input */}

                                    <div className="profile-file-input">

                                        <input
                                            type="file"
                                            id="profileImage"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleProfileImageChange}
                                        />

                                        <label htmlFor="profileImage">

                                            <i className="fas fa-cloud-arrow-up"></i>

                                            <span>
                                                {profileImageFile
                                                    ? profileImageFile.name
                                                    : "Choose Profile Image"}
                                            </span>

                                        </label>

                                    </div>

                                    {/* Upload Button */}

                                    <button
                                        type="button"
                                        className="profile-upload-btn"
                                        onClick={handleProfileImageUpload}
                                        disabled={uploadingProfileImage}
                                    >

                                        <i
                                            className={
                                                uploadingProfileImage
                                                    ? "fas fa-spinner fa-spin"
                                                    : "fas fa-upload"
                                            }
                                        ></i>

                                        {uploadingProfileImage
                                            ? "Uploading..."
                                            : "Upload Profile Image"}

                                    </button>

                                    {/* Message */}

                                    {profileImageMessage && (
                                        <div className="profile-image-message">

                                            <i className="fas fa-circle-info"></i>

                                            {profileImageMessage}

                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* Actions */}

                            <div className="form-actions">

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <FaSpinner className="spinning" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Update Profile
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

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

export default AdminProfile;