import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import API from "../services/api";
import "../css/SkillsPage.css";


const tools = [
    { name: "Git", icon: "fab fa-git-alt", color: "#f05032" },
    { name: "GitHub", icon: "fab fa-github", color: "#24292e" },
    { name: "VS Code", icon: "fas fa-code", color: "#007acc" },
    { name: "Postman", icon: "fas fa-paper-plane", color: "#ef5b25" },
    { name: "Eclipse", icon: "devicon-eclipse-plain colored" },
    { name: "Chrome DevTools", icon: "fab fa-chrome", color: "#4285f4" },
    { name: "Netlify", icon: "fas fa-cloud", color: "#00c7b7" },
];

const SkillsPage = () => {

    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchSkills = async () => {

            try {

                const response =
                    await API.get("/skills");

                if (response.data.success) {

                    setSkills(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch skills:",
                    error
                );

                setError(
                    "Unable to load skills."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchSkills();

    }, []);


    const categoryConfig = {
        Frontend: {
            title: "Frontend Development",
            icon: "fas fa-display"
        },

        Backend: {
            title: "Backend Development",
            icon: "fas fa-server"
        },

        Database: {
            title: "Database",
            icon: "fas fa-database"
        },

        Tools: {
            title: "Tools & Others",
            icon: "fas fa-screwdriver-wrench"
        }
    };


    const groupedSkills = skills.reduce(
        (groups, skill) => {

            const category =
                skill.category || "Tools";

            if (!groups[category]) {

                groups[category] = [];

            }

            groups[category].push(skill);

            return groups;

        },
        {}
    );

    return (
        <>
            <main className="page">
                {/* Hero */}
                <div className="skills-hero">
                    <div className="hero-left">
                        <div className="skills-label">MY SKILLS</div>

                        <h1 className="hero-heading">
                            My Technical Skills
                        </h1>

                        <p className="hero-bio">
                            I love learning new technologies and building
                            modern web applications with clean and
                            efficient code.
                        </p>

                        <div className="hero-line"></div>
                    </div>

                    <div className="orbit-wrap">
                        <div className="orbit-circle oc2"></div>
                        <div className="orbit-circle oc1"></div>

                        <div className="orbit-center">
                            <i className="fas fa-code"></i>
                        </div>

                        <div
                            className="tech-badge tb-js tb-js-bg"
                            style={{ top: "4px", left: "30px" }}
                        >
                            JS
                        </div>

                        <div
                            className="tech-badge tb-tag"
                            style={{
                                top: "4px",
                                right: "24px",
                                fontSize: "1.3rem",
                            }}
                        >
                            <i className="fas fa-code"></i>
                        </div>

                        <div
                            className="tech-badge tb-react"
                            style={{
                                bottom: "14px",
                                left: "20px",
                            }}
                        >
                            <i className="fab fa-react"></i>
                        </div>

                        <div
                            className="tech-badge tb-node"
                            style={{
                                bottom: "14px",
                                right: "16px",
                            }}
                        >
                            <i className="fab fa-node-js"></i>
                        </div>
                    </div>
                </div>


                {/* Skills Grid */}
                <div className="skills-grid">

                    {loading && (

                        <div className="skills-loading">
                            Loading skills...
                        </div>

                    )}


                    {error && (

                        <div className="skills-error">
                            {error}
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        Object.entries(groupedSkills).map(
                            ([categoryName, categorySkills]) => {

                                const config =
                                    categoryConfig[categoryName] || {
                                        title: categoryName,
                                        icon: "fas fa-code"
                                    };


                                return (

                                    <div
                                        className="skill-card"
                                        key={categoryName}
                                    >

                                        {/* CATEGORY HEADER */}

                                        <div className="skill-card-header">

                                            <div className="skill-card-icon">

                                                <i
                                                    className={
                                                        config.icon
                                                    }
                                                ></i>

                                            </div>


                                            <div className="skill-card-title">

                                                {config.title}

                                            </div>

                                        </div>


                                        {/* SKILLS */}

                                        <div className="skill-bar-list">

                                            {categorySkills
                                                .sort(
                                                    (a, b) =>
                                                        Number(
                                                            a.display_order
                                                        ) -
                                                        Number(
                                                            b.display_order
                                                        )
                                                )
                                                .map((skill) => (

                                                    <div
                                                        className="skill-bar-item"
                                                        key={skill.id}
                                                    >

                                                        <div className="skill-bar-top">

                                                            <span className="skill-page-name">

                                                                <span className="skill-dot"></span>

                                                                {skill.name}

                                                            </span>


                                                            <span className="skill-pct">

                                                                {skill.proficiency}%

                                                            </span>

                                                        </div>


                                                        <div className="bar-track">

                                                            <div
                                                                className="bar-fill"
                                                                style={{
                                                                    width:
                                                                        `${skill.proficiency}%`
                                                                }}
                                                            ></div>

                                                        </div>

                                                    </div>

                                                ))}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                </div>

                <div className="container">


                    {/* Tools */}
                    <div className="tools-section">
                        <div className="tools-title">
                            Tools I Use
                        </div>

                        <div className="tools-underline"></div>

                        <div className="skills-tools-grid">
                            {tools.map((tool, index) => (
                                <div
                                    className="tool-item"
                                    key={index}
                                >
                                    <div
                                        className="tool-icon"
                                        style={{ color: tool.color }}
                                    >
                                        <i className={tool.icon}></i>
                                    </div>

                                    <span className="tool-name">
                                        {tool.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default SkillsPage;
