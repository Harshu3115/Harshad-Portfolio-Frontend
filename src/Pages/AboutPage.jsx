import { useEffect, useState } from "react";

import harshadImg from "../assets/harsh.jpg";

import API from "../services/api";

import "../css/AboutPage.css";

import Footer from "../components/Footer";

const AboutPage = () => {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await API.get("/profile");

                if (response.data.success) {

                    setProfile(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch profile:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    return (
        <>

            <main className="about-page-container">

                <div className="about-page-top">

                    <div className="about-content-left">

                        <div className="about-page-label">
                            About Me
                        </div>

                        <h1 className="about-page-heading">
                            Who I Am
                        </h1>

                        <p className="about-page-bio">
                            {profile?.bio ||
                                "I'm a passionate Web Developer focused on creating modern, responsive and user-friendly websites."}
                        </p>

                        <ul className="about-info-list">
                            <li className="about-info-item">
                                <div className="about-info-icon">
                                    <i className="fas fa-location-dot"></i>
                                </div>

                                <div className="about-info-content">
                                    <strong>Location</strong>
                                    <span>
                                        {profile?.location || "Pune, Maharashtra, India"}
                                    </span>
                                </div>
                            </li>

                            <li className="about-info-item">
                                <div className="about-info-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>

                                <div className="about-info-content">
                                    <strong>Email</strong>
                                    <span>
                                        {profile?.email || ""}
                                    </span>
                                </div>
                            </li>

                            <li className="about-info-item">
                                <div className="about-info-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>

                                <div className="about-info-content">
                                    <strong>Availability</strong>
                                    <span>
                                        {profile?.availability || "Available for Freelance"}
                                    </span>
                                </div>
                            </li>
                        </ul>

                        <div className="about-signature">
                            {profile?.name || "Harshad Shinde"}
                        </div>

                        <div className="sig-line"></div>

                    </div>

                    <div className="about-image-card">

                        <div className="about-image-wrapper">
                            <img
                                src={harshadImg}
                                alt="Harshad"
                                className="about-profile-image"
                            />
                        </div>

                    </div>

                </div>

                <div className="about-stats-section">

                    <div className="about-stat-card">
                        <div className="about-stat-icon">
                            <i className="fas fa-code"></i>
                        </div>
                        <div className="about-stat-number">10+</div>
                        <div className="about-stat-text">Projects Completed</div>
                    </div>

                    <div className="about-stat-card">
                        <div className="about-stat-icon">
                            <i className="fas fa-face-smile"></i>
                        </div>
                        <div className="about-stat-number">100%</div>
                        <div className="about-stat-text">Client Satisfaction</div>
                    </div>

                    <div className="about-stat-card">
                        <div className="about-stat-icon">
                            <i className="fas fa-trophy"></i>
                        </div>
                        <div className="about-stat-number">1+</div>
                        <div className="about-stat-text">Years Experience</div>
                    </div>

                    <div className="about-stat-card">
                        <div className="about-stat-icon">
                            <i className="fas fa-headset"></i>
                        </div>
                        <div className="about-stat-number">24/7</div>
                        <div className="about-stat-text">Support Available</div>
                    </div>

                </div>



            </main>
            {/* =========================
                    MISSION / VISION / GOALS
                ========================= */}

            <div className="about-purpose-section">

                <div className="about-purpose-header">
                    <span className="about-page-label">
                        My Purpose
                    </span>

                    <h2 className="about-purpose-heading">
                        What Drives Me
                    </h2>

                    <p className="about-purpose-subtitle">
                        My mission, vision and goals guide me in building meaningful
                        digital experiences and continuously improving as a developer.
                    </p>
                </div>


                <div className="about-purpose-grid">

                    {/* Mission */}
                    <div className="about-purpose-card">

                        <div className="about-purpose-icon mission-icon">
                            <i className="fas fa-bullseye"></i>
                        </div>

                        <div className="about-purpose-number">
                            01
                        </div>

                        <h3>
                            My Mission
                        </h3>

                        <p>
                            My mission is to build modern, responsive and
                            user-friendly web applications that solve real-world
                            problems. I aim to write clean, maintainable code and
                            create digital experiences that provide real value to
                            users and businesses.
                        </p>

                    </div>


                    {/* Vision */}
                    <div className="about-purpose-card">

                        <div className="about-purpose-icon vision-icon">
                            <i className="fas fa-eye"></i>
                        </div>

                        <div className="about-purpose-number">
                            02
                        </div>

                        <h3>
                            My Vision
                        </h3>

                        <p>
                            My vision is to become a skilled and reliable full-stack
                            developer who can transform ideas into scalable,
                            innovative and impactful software solutions while
                            continuously learning new technologies.
                        </p>

                    </div>


                    {/* Goals */}
                    <div className="about-purpose-card">

                        <div className="about-purpose-icon goals-icon">
                            <i className="fas fa-flag-checkered"></i>
                        </div>

                        <div className="about-purpose-number">
                            03
                        </div>

                        <h3>
                            My Goals
                        </h3>

                        <p>
                            My goal is to continuously improve my technical skills,
                            work on challenging real-world projects, learn emerging
                            technologies and contribute to professional teams while
                            growing both personally and professionally.
                        </p>

                    </div>

                </div>

            </div>

            <Footer />
        </>


    );
};

export default AboutPage;
