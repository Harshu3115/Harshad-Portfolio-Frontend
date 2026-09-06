import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "../css/Auth.css";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/forgot-password",
                {
                    email
                }
            );

            if (response.data.success) {

                toast.success(
                    response.data.message
                );

                setEmail("");

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h1>Forgot Password?</h1>

                <p>
                    Enter your registered email address
                    and we'll send you a password reset link.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="auth-input-group">

                        <label>Email Address</label>

                        <div className="auth-input-wrapper">

                            <i className="fas fa-envelope"></i>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Sending...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Send Reset Link
                            </>
                        )}

                    </button>

                </form>

                <Link
                    to="/admin/login"
                    className="back-login"
                >
                    <i className="fas fa-arrow-left"></i>
                    Back to Login
                </Link>

            </div>

        </div>
    );
};

export default ForgotPassword;