import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import { FaDownload } from "react-icons/fa";
import API from "../services/api";

const Navbar = () => {

    const [profile, setProfile] = useState(null);

    // =====================================
    // FETCH PROFILE
    // =====================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await API.get("/profile");

                console.log(
                    "Profile:",
                    response.data
                );

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


    // =====================================
    // CLOSE MOBILE NAVBAR
    // =====================================

    const closeNavbar = () => {

        const navMenu =
            document.getElementById("navMenu");

        if (
            navMenu &&
            navMenu.classList.contains("show")
        ) {

            navMenu.classList.remove("show");

        }

    };


    // =====================================
    // BACKEND URL
    // =====================================

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:5000/api";

    const BACKEND_URL =
        API_BASE_URL.replace("/api", "");


    // =====================================
    // DYNAMIC RESUME URL
    // =====================================

    const resumeUrl = profile?.resume_url
        ? (
            profile.resume_url.startsWith("https://") ||
            profile.resume_url.startsWith("http://")
        )
            ? profile.resume_url
            : `${BACKEND_URL}${profile.resume_url}`
        : null;


    return (

        <nav className="navbar navbar-expand-lg">

            <div className="container">

                {/* ================= LOGO ================= */}

                <NavLink
                    className="navbar-brand"
                    to="/"
                    onClick={closeNavbar}
                >

                    <span>&lt;/&gt;</span>

                    {profile?.name ||
                        "Harshad Shinde"}

                </NavLink>


                {/* ================= MOBILE BUTTON ================= */}

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navMenu"
                    aria-controls="navMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                {/* ================= NAVIGATION ================= */}

                <div
                    className="collapse navbar-collapse"
                    id="navMenu"
                >

                    <ul className="navbar-nav mx-auto gap-1">

                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/"
                                onClick={closeNavbar}
                            >
                                Home
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/about"
                                onClick={closeNavbar}
                            >
                                About
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/skills"
                                onClick={closeNavbar}
                            >
                                Skills
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/projects"
                                onClick={closeNavbar}
                            >
                                Projects
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/experience"
                                onClick={closeNavbar}
                            >
                                Experience
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                className="nav-link"
                                to="/contact"
                                onClick={closeNavbar}
                            >
                                Contact
                            </NavLink>

                        </li>

                    </ul>


                    {/* ================= RESUME ================= */}

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">

                        {resumeUrl ? (

                            <a
                                href={resumeUrl}
                                download="Harshad_Shinde_Resume.pdf"
                                className="btn-cv download-resume"
                                target="_blank"
                                rel="noopener noreferrer"
                            >

                                <FaDownload />

                                Download Resume

                            </a>

                        ) : (

                            <span className="resume-loading">
                                Resume unavailable
                            </span>

                        )}

                    </div>

                </div>

            </div>

        </nav>

    );

};

export default Navbar;