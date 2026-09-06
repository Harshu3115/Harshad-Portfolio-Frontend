import { useEffect, useState } from "react";

import "../css/Skills.css";

import API from "../services/api";


function Skills() {

    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchSkills = async () => {

            try {

                const response = await API.get("/skills");

                if (response.data.success) {
                    setSkills(response.data.data);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch skills:",
                    error
                );

                setError("Unable to load skills.");

            } finally {

                setLoading(false);

            }

        };

        fetchSkills();

    }, []);


    /*
     * Duplicate the skills.
     *
     * This allows the animation to move continuously
     * without needing Swiper.
     */
    const marqueeSkills = [...skills, ...skills];


    if (loading) {
        return (
            <section className="skills-section">

                <div className="section-header">
                    <div className="skill-section-label">
                        MY SKILLS
                    </div>

                    <h2 className="section-title">
                        Technologies I Work With
                    </h2>
                </div>

                <div className="skills-loading">
                    Loading skills...
                </div>

            </section>
        );
    }


    if (error) {
        return (
            <section className="skills-section">

                <div className="section-header">
                    <div className="skill-section-label">
                        MY SKILLS
                    </div>

                    <h2 className="section-title">
                        Technologies I Work With
                    </h2>
                </div>

                <div className="skills-error">
                    {error}
                </div>

            </section>
        );
    }


    return (

        <section className="skills-section">

            {/* Header */}

            <div className="section-header">

                <div className="skill-section-label">
                    MY SKILLS
                </div>

                <h2 className="section-title">
                    Technologies I Work With
                </h2>

            </div>


            {/* Marquee */}

            <div className="skills-marquee">

                <div className="skills-track">

                    {marqueeSkills.map((skill, index) => (

                        <div
                            className="skill-slide"
                            key={`${skill.id}-${index}`}
                        >

                            <div className="skill-card">

                                <span className="skill-icon">

                                    <i
                                        className={skill.icon}
                                    ></i>

                                </span>


                                <h5 className="skill-name">

                                    {skill.name}

                                </h5>


                                <div className="skill-bar-wrap">

                                    <div
                                        className="skill-bar"
                                        style={{
                                            width: `${skill.proficiency}%`
                                        }}
                                    ></div>

                                </div>


                                <span className="skill-pct">

                                    {skill.proficiency}%

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}


export default Skills;