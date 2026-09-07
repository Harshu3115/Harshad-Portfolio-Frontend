import { useEffect, useState } from "react";

import "../css/ProjectCom.css";
import Category from "./Category";
import API from "../services/api";

import { SERVER_URL } from "../services/appConfig";


const Projects = () => {

    const [activeFilter, setActiveFilter] = useState("all");

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [isProjectPaused, setIsProjectPaused] = useState(false);





    // ===============================
    // FETCH PROJECTS
    // ===============================

    useEffect(() => {

        const fetchProjects = async () => {

            try {

                const response = await API.get("/projects");

                if (response.data.success) {

                    setProjects(response.data.data);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch projects:",
                    error
                );

                setError(
                    "Unable to load projects."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProjects();

    }, []);





    // ===============================
    // FILTER PROJECTS
    // ===============================

    const filteredProjects =
        activeFilter === "all"
            ? projects
            : projects.filter((project) =>
                project.category
                    ?.split(",")
                    .map((category) => category.trim().toLowerCase())
                    .includes(activeFilter.toLowerCase())
            );
    const getImageUrl = (image) => {
        if (!image) return "";

        // Fix malformed Cloudinary URL
        const fixedImage = image.replace(/^https\/\//, "https://");

        // Already a complete URL
        if (
            fixedImage.startsWith("https://") ||
            fixedImage.startsWith("http://")
        ) {
            return fixedImage;
        }

        // Old local upload
        return `${SERVER_URL}${fixedImage}`;
    };

    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (

            <section
                className="projects-section"
                id="projects"
            >

                <div className="container">

                    <div className="projects-header">

                        <div>

                            <span className="skill-section-label">
                                MY PROJECTS
                            </span>

                            <h2 className="skill-section-title">
                                Featured Projects
                            </h2>

                            <p className="skill-section-subtitle">
                                Loading projects...
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        );

    }


    // ===============================
    // ERROR
    // ===============================

    if (error) {

        return (

            <section
                className="projects-section"
                id="projects"
            >

                <div className="container">

                    <div className="projects-header">

                        <div>

                            <span className="skill-section-label">
                                MY PROJECTS
                            </span>

                            <h2 className="skill-section-title">
                                Featured Projects
                            </h2>

                            <p className="skill-section-subtitle">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        );

    }


    // ===============================
    // MAIN UI
    // ===============================

    return (

        <section
            className="projects-section"
            id="projects"
        >

            <div className="container">

                {/* Header */}

                <div className="projects-header">

                    <div>

                        <span className="skill-section-label">
                            MY PROJECTS
                        </span>

                        <h2 className="skill-section-title">
                            Featured Projects
                        </h2>

                        <p className="skill-section-subtitle">
                            Each project reflects my passion
                            for clean code and innovative solutions
                        </p>

                    </div>


                    <a
                        href="https://github.com/Harshu3115"
                        className="view-all-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        View All

                        <i className="fas fa-arrow-right"></i>

                    </a>

                </div>


                {/* Category Filter */}

                <Category
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />


                {/* Projects Grid */}

                <div className="projects-slider">
                    <div
                        className={`projects-slider-track ${isProjectPaused ? "projects-paused" : ""
                            }`}
                    >

                        {/* ================= FIRST SET ================= */}

                        {filteredProjects.map((project, index) => (
                            <div
                                key={`first-${project.id}`}
                                className="project-card"
                                onClick={() => setIsProjectPaused(true)}
                            >

                                <div className="project-card-inner">


                                    {/* =========================
                                        FRONT SIDE
                                    ========================= */}

                                    <div className="project-card-front">

                                        <div className="project-image">

                                            {project.image ? (

                                                <img
                                                    src={getImageUrl(project.image)}
                                                    alt={project.title}
                                                />

                                            ) : (

                                                <div className="project-image-placeholder">
                                                    No Image
                                                </div>

                                            )}


                                            <div className="project-overlay">

                                                <span className="project-number">

                                                    #
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>

                                            </div>

                                        </div>


                                        <div className="project-content">

                                            <h3 className="project-title">

                                                {project.title}

                                            </h3>


                                            <p className="project-description">

                                                {project.description}

                                            </p>


                                            {/* Category */}

                                            <div className="project-tags">
                                                {project.category
                                                    ?.split(",")
                                                    .map((category) => (
                                                        <span
                                                            className="tag"
                                                            key={category.trim()}
                                                        >
                                                            {category.trim()}
                                                        </span>
                                                    ))}
                                            </div>


                                            {/* GitHub */}

                                            {project.github_url && (

                                                <a
                                                    href={
                                                        project.github_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mobile-repo-btn"
                                                >

                                                    <i className="fab fa-github"></i>

                                                    View Code

                                                </a>

                                            )}

                                        </div>

                                    </div>


                                    {/* =========================
                                        BACK SIDE
                                    ========================= */}

                                    <div className="project-card-back">

                                        <div className="back-content">

                                            <div className="back-icon">

                                                <i className="fab fa-github"></i>

                                            </div>


                                            <h3>
                                                Explore the Code
                                            </h3>


                                            <p>

                                                Dive into the source
                                                code, contribute, or
                                                use it as inspiration
                                                for your own projects.

                                            </p>


                                            <div className="back-actions">


                                                {/* GitHub */}

                                                {project.github_url && (

                                                    <a
                                                        href={
                                                            project.github_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-primary"
                                                    >

                                                        <i className="fab fa-github"></i>

                                                        Repository

                                                    </a>

                                                )}


                                                {/* Live Demo */}

                                                {project.demo_url && (

                                                    <a
                                                        href={
                                                            project.demo_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-secondary"
                                                    >

                                                        <i className="fas fa-external-link-alt"></i>

                                                        Live Demo

                                                    </a>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}


                        {filteredProjects.map((project, index) => (
                            <div
                                key={`second-${project.id}`}
                                className="project-card project-card-clone"
                                onClick={() => setIsProjectPaused(true)}
                            >

                                <div className="project-card-inner">


                                    {/* =========================
                                        FRONT SIDE
                                    ========================= */}

                                    <div className="project-card-front">

                                        <div className="project-image">

                                            {project.image ? (
                                                <img
                                                    src={getImageUrl(project.image)}
                                                    alt={project.title}
                                                />
                                            ) : (
                                                <div className="project-image-placeholder">
                                                    No Image
                                                </div>
                                            )}


                                            <div className="project-overlay">

                                                <span className="project-number">

                                                    #
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>

                                            </div>

                                        </div>


                                        <div className="project-content">

                                            <h3 className="project-title">

                                                {project.title}

                                            </h3>


                                            <p className="project-description">

                                                {project.description}

                                            </p>


                                            {/* Category */}

                                            <div className="project-tags">
                                                {project.category
                                                    ?.split(",")
                                                    .map((category) => (
                                                        <span
                                                            className="tag"
                                                            key={category.trim()}
                                                        >
                                                            {category.trim()}
                                                        </span>
                                                    ))}
                                            </div>


                                            {/* GitHub */}

                                            {project.github_url && (

                                                <a
                                                    href={
                                                        project.github_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mobile-repo-btn"
                                                >

                                                    <i className="fab fa-github"></i>

                                                    View Code

                                                </a>

                                            )}

                                        </div>

                                    </div>


                                    {/* =========================
                                        BACK SIDE
                                    ========================= */}

                                    <div className="project-card-back">

                                        <div className="back-content">

                                            <div className="back-icon">

                                                <i className="fab fa-github"></i>

                                            </div>


                                            <h3>
                                                Explore the Code
                                            </h3>


                                            <p>

                                                Dive into the source
                                                code, contribute, or
                                                use it as inspiration
                                                for your own projects.

                                            </p>


                                            <div className="back-actions">


                                                {/* GitHub */}

                                                {project.github_url && (

                                                    <a
                                                        href={
                                                            project.github_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-primary"
                                                    >

                                                        <i className="fab fa-github"></i>

                                                        Repository

                                                    </a>

                                                )}


                                                {/* Live Demo */}

                                                {project.demo_url && (

                                                    <a
                                                        href={
                                                            project.demo_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-secondary"
                                                    >

                                                        <i className="fas fa-external-link-alt"></i>

                                                        Live Demo

                                                    </a>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>






            </div>

        </section >

    );

};


export default Projects;