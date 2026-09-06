import React, { useEffect, useState } from "react";
import aboutImg from "../assets/harsh.jpg";
import "../css/AboutCom.css"
import API from "../services/api";
import { Link } from "react-router-dom";

const About = () => {

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
        <section className="about-section" id="about">
            <div className="container">
                <div className="row align-items-center g-5">

                    {/* Left Side */}
                    <div className="col-12 col-md-10 col-lg-5 mx-auto fade-up">
                        <div className="about-img-wrap">
                            <img
                                src={aboutImg}
                                alt="Harshad Shinde"
                                className="about-img"
                                loading="lazy"
                            />

                            <div className="exp-badge">
                                <i className="fas fa-briefcase exp-icon"></i>

                                <div>
                                    <div className="exp-num">1+</div>
                                    <div className="exp-text">
                                        Years <br />
                                        Experience
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="col-12 col-lg-7 fade-up">
                        <div className="section-label">ABOUT ME</div>

                        <h2 className="section-title">
                            Passionate <em>about</em> building
                            <br />
                            digital solutions
                        </h2>

                        <p className="about-desc">
                            {profile?.bio ||
                                "I'm a passionate Full Stack Developer who loves turning ideas into real products."}
                        </p>

                        <div className="about-info">

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <div className="info-label">Location</div>
                                    <div className="info-val">
                                        {profile?.location || "Pune, Maharashtra, India"}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div>
                                    <div className="info-label">Availability</div>
                                    <div className="info-val">
                                        {profile?.availability || "Available for opportunities"}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <div className="info-label">Email</div>
                                    <div className="info-val">
                                        {profile?.email || ""}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-pencil-alt"></i>
                                </div>
                                <div>
                                    <div className="info-label">Freelance</div>
                                    <div className="info-val">Available</div>
                                </div>
                            </div>

                        </div>

                        <Link to="/about" className="btn-know">
                            Know More About Me{" "}
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;