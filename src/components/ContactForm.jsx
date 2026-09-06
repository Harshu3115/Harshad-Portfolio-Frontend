import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import API from "../services/api";
import "../css/ContactForm.css";

const ContactForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove error when user starts correcting the field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const name = formData.name.trim();
        const email = formData.email.trim();
        const subject = formData.subject.trim();
        const message = formData.message.trim();

        // Name
        if (!name) {
            newErrors.name = "Name is required.";
        } else if (name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        } else if (name.length > 50) {
            newErrors.name = "Name must not exceed 50 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            newErrors.name = "Name can contain only letters and spaces.";
        }

        // Email
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
        ) {
            newErrors.email = "Please enter a valid email address.";
        } else if (email.length > 100) {
            newErrors.email = "Email must not exceed 100 characters.";
        }

        // Subject
        if (!subject) {
            newErrors.subject = "Subject is required.";
        } else if (subject.length < 3) {
            newErrors.subject = "Subject must be at least 3 characters.";
        } else if (subject.length > 100) {
            newErrors.subject = "Subject must not exceed 100 characters.";
        }

        // Message
        if (!message) {
            newErrors.message = "Message is required.";
        } else if (message.length < 10) {
            newErrors.message = "Message must be at least 10 characters.";
        } else if (message.length > 1000) {
            newErrors.message = "Message must not exceed 1000 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const sendMessage = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            // Get values from formData
            const name = formData.name.trim();
            const email = formData.email.trim();
            const subject = formData.subject.trim();
            const message = formData.message.trim();

            // ==============================
            // 1. SAVE MESSAGE TO DATABASE
            // ==============================

            const response = await API.post(
                "/messages",
                {
                    name,
                    email,
                    subject,
                    message
                }
            );

            if (!response.data.success) {

                throw new Error(
                    response.data.message ||
                    "Failed to save message"
                );

            }

            // ==============================
            // 2. SEND EMAIL USING EMAILJS
            // ==============================

            await emailjs.send(
                "service_cl18ddp",
                "template_k76a7cq",
                {
                    name: name,
                    email: email,
                    title: subject,
                    message: message
                },
                "SPPF4O1qZWFDVMMmi"
            );

            // ==============================
            // 3. SUCCESS
            // ==============================

            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 3000);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to send message"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await API.get("/profile");

                setProfile(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

            }

        };

        fetchProfile();

    }, []);

    return (
        <main className="contact-page">


            {/* Hero */}
            <div className="contact-hero">
                <div className="contact-label">
                    <span className="dot"></span>
                    Contact Me
                    <span className="dot"></span>
                </div>

                <h1 className="contact-heading">
                    Let's Work Together
                </h1>

                <p className="contact-sub">
                    Have a project in mind or want to discuss an opportunity?
                    <br />
                    Feel free to reach out to me.
                </p>
            </div>

            <div className="contact-grid">

                {/* Left Side */}
                <div className="contact-info-card">

                    <h2 className="git-title">
                        Get In Touch
                    </h2>

                    <div className="git-underline"></div>

                    <p className="git-desc">
                        I'm currently available for freelance work
                        and full-time opportunities.
                    </p>

                    <ul className="info-list">

                        <li className="info-item">
                            <div className="info-icon">
                                <i className="fas fa-envelope"></i>
                            </div>

                            <div className="info-text">
                                <strong>Email</strong>
                                <span>
                                    {profile?.email || "Loading..."}
                                </span>
                            </div>
                        </li>

                        <li className="info-item">
                            <div className="info-icon">
                                <i className="fas fa-phone"></i>
                            </div>

                            <div className="info-text">
                                <strong>Phone</strong>
                                <span>
                                    {profile?.phone || "Loading..."}
                                </span>
                            </div>
                        </li>

                        <li className="info-item">
                            <div className="info-icon">
                                <i className="fas fa-location-dot"></i>
                            </div>

                            <div className="info-text">
                                <strong>Location</strong>
                                <span>
                                    {profile?.location || "Loading..."}
                                </span>
                            </div>
                        </li>

                    </ul>

                </div>

                {/* Right Form */}
                <form
                    className="contact-form-card"
                    onSubmit={sendMessage}
                >

                    <h2 className="form-title">
                        Send Me a Message
                    </h2>

                    <div className="form-underline"></div>

                    <div className="form-row">

                        <div className="field-group">
                            <div className={`field ${errors.name ? "has-error" : ""}`}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    maxLength={50}
                                />

                                <span className="field-icon">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>

                            {errors.name && (
                                <small className="validation-error">
                                    {errors.name}
                                </small>
                            )}
                        </div>

                        <div className="field-group">
                            <div className={`field ${errors.email ? "has-error" : ""}`}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    maxLength={100}
                                />

                                <span className="field-icon">
                                    <i className="fas fa-envelope"></i>
                                </span>
                            </div>

                            {errors.email && (
                                <small className="validation-error">
                                    {errors.email}
                                </small>
                            )}
                        </div>

                    </div>

                    <div className="field-group field-full">
                        <div className={`field ${errors.subject ? "has-error" : ""}`}>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                maxLength={100}
                            />

                            <span className="field-icon">
                                <i className="fas fa-tag"></i>
                            </span>
                        </div>

                        {errors.subject && (
                            <small className="validation-error">
                                {errors.subject}
                            </small>
                        )}
                    </div>

                    <div className="field-group field-full">
                        <div className={`field textarea-wrap ${errors.message ? "has-error" : ""}`}>
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                maxLength={1000}
                            ></textarea>

                            <span className="field-icon">
                                <i className="fas fa-pen-to-square"></i>
                            </span>
                        </div>

                        {errors.message && (
                            <small className="validation-error">
                                {errors.message}
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-send"
                        disabled={loading}
                    >
                        <i
                            className={
                                loading
                                    ? "fas fa-spinner fa-spin"
                                    : "fas fa-paper-plane"
                            }
                        ></i>

                        {loading
                            ? " Sending..."
                            : " Send Message"}
                    </button>

                </form>

            </div>

            {/* Toast Message */}
            {showToast && (
                <div className="toast show">
                    <i className="fas fa-circle-check"></i>
                    <span>
                        Message sent successfully! I'll get back to you soon.
                    </span>
                </div>
            )}

        </main>
    );
};

export default ContactForm;
