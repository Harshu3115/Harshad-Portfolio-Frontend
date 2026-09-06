import Footer from "../components/Footer";
import Projects from "../components/Projects";

import projectImg from "../assets/project-img.png";
import "../css/ProjectPage.css";
import { Link } from "react-router-dom";

const ProjectPage = () => {
    return (
        <>
            <main className="page">

                {/* Hero Section */}
                <section className="projects-hero">

                    <div className="hero-left">

                        <div className="hero-label">
                            MY PROJECTS
                        </div>

                        <h1 className="hero-heading">
                            Projects That
                            <br />
                            <span>I Built</span>
                        </h1>

                        <p className="hero-bio">
                            Here are some of my selected projects.
                            Each project taught me something new and
                            helped me grow as a developer.
                        </p>

                        <div className="hero-btns">

                            <a
                                href="https://github.com/Harshu3115"
                                target="_blank"
                                rel="noreferrer"
                                className="btn-github"
                            >
                                GitHub Profile
                            </a>

                            <Link
                                to="/contact"
                                className="btn-contact"
                            >
                                Contact Me
                            </Link>

                        </div>

                    </div>

                    <div className="hero-illus">
                        <img
                            src={projectImg}
                            alt="Projects"
                        />
                    </div>

                </section>



            </main>
            {/* Category Component */}


            {/* Projects Component */}
            <Projects />

            <Footer />
        </>
    );
};

export default ProjectPage;
