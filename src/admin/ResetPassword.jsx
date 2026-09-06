import React, { useState } from "react";
import {
    Link,
    useSearchParams,
    useNavigate
} from "react-router-dom";

import API from "../services/api";
import { toast } from "react-toastify";
import "../css/Auth.css";

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 👁️ Password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        if (password.length < 6) {
            toast.error(
                "Password must be at least 6 characters"
            );
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/reset-password",
                {
                    token,
                    password
                }
            );

            if (response.data.success) {

                toast.success(
                    "Password reset successfully"
                );

                setTimeout(() => {
                    navigate("/admin/login");
                }, 1500);

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to reset password"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    <i className="fas fa-key"></i>
                </div>

                <h1>Reset Password</h1>

                <p>
                    Create a new password for your
                    admin account.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* =========================
                        NEW PASSWORD
                    ========================= */}

                    <div className="auth-input-group">

                        <label>New Password</label>

                        <div className="auth-input-wrapper">



                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <i
                                    className={
                                        showPassword
                                            ? "fas fa-eye-slash"
                                            : "fas fa-eye"
                                    }
                                ></i>
                            </button>

                        </div>

                    </div>


                    {/* =========================
                        CONFIRM PASSWORD
                    ========================= */}

                    <div className="auth-input-group">

                        <label>Confirm Password</label>

                        <div className="auth-input-wrapper">

                            {/* <i className="fas fa-lock"></i> */}

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <i
                                    className={
                                        showConfirmPassword
                                            ? "fas fa-eye-slash"
                                            : "fas fa-eye"
                                    }
                                ></i>
                            </button>

                        </div>

                    </div>


                    {/* =========================
                        SUBMIT
                    ========================= */}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Resetting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check"></i>
                                Reset Password
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

export default ResetPassword;