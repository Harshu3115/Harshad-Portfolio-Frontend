import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import API from "../services/api";
import "../css/AdminLogin.css";

const AdminLogin = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );

            if (response.data.success) {

                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                localStorage.setItem(
                    "admin",
                    JSON.stringify(response.data.admin)
                );

                toast.success("Login successful! Welcome back.");

                navigate("/admin/dashboard");

            }

        } catch (error) {

            const errorMessage = error.response?.data?.message ||
                "Login failed. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">



                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Login to manage your portfolio</p>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    {/* Email Field */}
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter admin email"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                tabIndex="-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="forgot-password-wrapper">

                        <Link
                            to="/admin/forgot-password"
                            className="forgot-password-link"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <FaArrowRight className="btn-icon" />
                            </>
                        )}
                    </button>

                </form>

                {/* Signup Link */}
                <div className="signup-link">
                    Don't have an account? <a href="#">Sign up</a>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    © 2026 Harshad Shinde. All rights reserved.
                </div>

            </div>

        </div>

    );

};

export default AdminLogin;