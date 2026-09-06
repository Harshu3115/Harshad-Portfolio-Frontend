import { useEffect, useState } from "react";
import API from "../services/api";
import { SERVER_URL } from "../services/appConfig";
import "../css/Hero.css";
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

const Hero = () => {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await API.get("/profile");

                if (response.data.success) {

                    setProfile(response.data.data);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch profile:",
                    error
                );

            }

        };

        fetchProfile();

    }, []);

    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const resumeUrl = profile?.resume_url
        ? `${BACKEND_URL}${profile.resume_url}`
        : null;

    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="row align-items-center">

                    {/* LEFT */}
                    <div className="col-lg-6 fade-up">
                        <div className="available-badge">
                            <span className="badge-dot"></span>
                            {profile?.availability || "Available for work"}
                        </div>

                        <p className="hero-hello">Hello, I'm</p>

                        <h1 className="hero-name">
                            {profile?.name || "Harshad Shinde"}
                        </h1>

                        <h2 className="hero-title">
                            {profile?.title || "Full Stack Developer"}
                        </h2>

                        <p className="hero-desc">
                            {profile?.bio ||
                                "I build modern, responsive and user-friendly web applications that solve real-world problems and deliver great user experiences."}
                        </p>

                        <div className="d-flex flex-wrap gap-3">

                            {/* Hire Me */}
                            {resumeUrl ? (

                                <a
                                    href={resumeUrl}
                                    download="Harshad_Shinde_Resume.pdf"
                                    className="btn-hire"
                                    target="_blank"
                                >

                                    <FaDownload />

                                    Download Resume

                                </a>

                            ) : (

                                <span className="resume-loading">
                                    Resume unavailable
                                </span>

                            )}

                            {/* View My Work */}
                            <Link to="/projects" className="btn-work">
                                View My Work
                                <i className="fas fa-arrow-right"></i>
                            </Link>


                            {/* Download Resume */}


                        </div>

                        <div className="hero-socials">
                            <a
                                href={profile?.github_url || "https://github.com/Harshu3115"}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                            >
                                <i className="fab fa-github"></i>
                            </a>

                            <a
                                href={
                                    profile?.linkedin_url ||
                                    "https://www.linkedin.com/"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>


                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile?.email || "harshadshinde3131@gmail.com"}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Send Email"
                            >
                                <i className="fas fa-envelope"></i>
                            </a>


                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-lg-6 d-flex justify-content-center hero-img-wrap">

                        <div className="hero-img-bg"></div>

                        <div className="hero-circle-wrap">
                            <div className="hero-circle-ring"></div>
                            <div className="hero-circle-ring ring-2"></div>

                            <img
                                src={
                                    profile?.profile_image
                                        ? `${SERVER_URL}${profile.profile_image}`
                                        : "/profile/harshad.png"
                                }
                                className="hero-img"
                                alt={profile?.name || "Harshad Shinde"}
                            />
                        </div>

                        {/* Floating Cards */}
                        <div className="float-card card-code">
                            <span className="fc-icon">&lt;/&gt;</span> Clean Code
                        </div>

                        <div className="float-card card-fast">
                            <span className="fc-icon">🚀</span> Fast Learner
                        </div>

                        <div className="float-card card-resp">
                            <span className="fc-icon">📱</span>
                            <span>
                                Responsive
                                <br />
                                Design
                            </span>
                        </div>

                        {/* Accent Dots */}
                        <span className="hero-dot dot-a"></span>
                        <span className="hero-dot dot-b"></span>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;