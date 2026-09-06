import { useEffect, useState } from "react";

import API from "../services/api";

import "../css/Experience.css";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import {
    SiPostman,
    SiMongodb,
    SiNetlify,
    SiEclipseide,
    SiMysql
} from "react-icons/si";

import {
    FaBriefcase,
    FaUserTie,
    FaLaptopCode,
    FaJava,
    FaTrophy,
    FaCheck,
    FaCode,
    FaGitAlt,
    FaGithub,
    FaChrome,
    FaCog,
} from "react-icons/fa";
import Education from "../components/Education";

const ExperiencePage = () => {

    const [experiences, setExperiences] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchExperiences = async () => {

            try {

                const response =
                    await API.get("/experience");

                if (response.data.success) {

                    setExperiences(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch experience:",
                    error
                );

                setError(
                    "Unable to load experience."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchExperiences();

    }, []);


    return (
        <>
            <div className="container">
                <div className="row">

                    {/* Section Label */}
                    <div className="section-label">
                        <span className="dot-lbl"></span>
                        MY EXPERIENCE
                    </div>

                    <div className="exp-content">

                        {/* Timeline */}
                        <div className="timeline-wrap">

                            {loading && (
                                <div className="tl-card">
                                    <p className="tl-desc">
                                        Loading experience...
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="tl-card">
                                    <p className="tl-desc">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {!loading &&
                                !error &&
                                experiences.map((experience, index) => {

                                    const startDate = experience.start_date
                                        ? new Date(experience.start_date)
                                        : null;

                                    const endDate = experience.end_date
                                        ? new Date(experience.end_date)
                                        : null;

                                    const formatDate = (date) => {

                                        if (!date) {
                                            return "";
                                        }

                                        return date.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                year: "numeric"
                                            }
                                        );

                                    };

                                    const startText =
                                        formatDate(startDate);

                                    const endText =
                                        experience.is_current
                                            ? "Present"
                                            : formatDate(endDate);

                                    const yearText =
                                        experience.is_current
                                            ? "Present"
                                            : startDate
                                                ? startDate.getFullYear()
                                                : "";

                                    return (

                                        <div
                                            className="tl-row"
                                            key={experience.id}
                                        >

                                            {/* DATE */}

                                            <div className="tl-date">

                                                <span className="tl-year">
                                                    {yearText}
                                                </span>

                                                <span className="tl-dates-sub">
                                                    {startText}
                                                    {" – "}
                                                    {endText}
                                                </span>

                                            </div>


                                            {/* TIMELINE */}

                                            <div className="tl-spine">

                                                <div className="tl-dot"></div>

                                                {index <
                                                    experiences.length - 1 && (
                                                        <div className="tl-line"></div>
                                                    )}

                                            </div>


                                            {/* EXPERIENCE CARD */}

                                            <div className="tl-card">

                                                <div className="tl-card-header">

                                                    <div className="tl-icon">
                                                        <FaBriefcase />
                                                    </div>

                                                    <div className="tl-info">

                                                        <div className="tl-title-row">

                                                            <span className="tl-job">
                                                                {experience.job_title}
                                                            </span>

                                                            {Boolean(
                                                                experience.is_current
                                                            ) && (
                                                                    <span className="tl-current">
                                                                        Current
                                                                    </span>
                                                                )}

                                                        </div>

                                                        <div className="tl-company">
                                                            {experience.company}
                                                        </div>

                                                    </div>

                                                </div>


                                                {experience.description && (

                                                    <p className="tl-desc">
                                                        {experience.description}
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    );

                                })}




                        </div>

                        {/* Sidebar */}
                        <div className="sidebar">

                            <div className="side-card">
                                <div className="side-title">
                                    <div className="side-title-icon">
                                        <FaTrophy />
                                    </div>
                                    What I've Gained
                                </div>

                                <ul className="gained-list">
                                    <li className="gained-item">
                                        <div className="gained-check">
                                            <FaCheck />
                                        </div>
                                        Hands-on experience in full stack development
                                    </li>

                                    <li className="gained-item">
                                        <div className="gained-check">
                                            <FaCheck />
                                        </div>
                                        Strong problem solving and debugging skills
                                    </li>

                                    <li className="gained-item">
                                        <div className="gained-check">
                                            <FaCheck />
                                        </div>
                                        Responsive website development
                                    </li>
                                </ul>
                            </div>

                            <div className="side-card">
                                <div className="side-title">
                                    <div className="side-title-icon">
                                        <FaCog />
                                    </div>
                                    Tools & Technologies
                                </div>

                                <div className="tools-grid">

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <FaCode style={{ color: "#007ACC" }} />
                                        </div>
                                        <span className="tool-name">VS Code</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <FaGitAlt style={{ color: "#F1502F" }} />
                                        </div>
                                        <span className="tool-name">Git</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <FaGithub style={{ color: "#181717" }} />
                                        </div>
                                        <span className="tool-name">GitHub</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <SiPostman style={{ color: "#FF6C37" }} />
                                        </div>
                                        <span className="tool-name">Postman</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <SiEclipseide style={{ color: "#2C2255" }} />
                                        </div>
                                        <span className="tool-name">Eclipse</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <FaChrome style={{ color: "#4285F4" }} />
                                        </div>
                                        <span className="tool-name">Chrome</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <SiMysql style={{ color: "#00758F" }} />
                                        </div>
                                        <span className="tool-name">MySQL</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <SiMongodb style={{ color: "#47A248" }} />
                                        </div>
                                        <span className="tool-name">MongoDB</span>
                                    </div>

                                    <div className="tool-item">
                                        <div className="tool-icon">
                                            <SiNetlify style={{ color: "#00C7B7" }} />
                                        </div>
                                        <span className="tool-name">Netlify</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    <Stats />

                    <Education />

                </div>

            </div>
            <br />

            <Footer />
        </>
    );
};
export default ExperiencePage;
