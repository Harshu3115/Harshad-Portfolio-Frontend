
import React, { useEffect, useState } from "react";
import "../css/JavaResources.css";
import { FaJava } from "react-icons/fa";
import {
    FaDownload,
    FaArrowLeft,
    FaExternalLinkAlt,
} from "react-icons/fa";
import Footer from "../components/Footer";
import API from "../services/api";

export default function JavaResources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await API.get("/java-resources");

                if (response.data.success) {
                    setResources(response.data.data || []);
                } else {
                    setError("Unable to load Java resources.");
                }
            } catch (err) {
                console.error("Java Resources API Error:", err);
                setError(
                    "Unable to load resources. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Group resources by type
    const interviewResources = resources.filter((resource) =>
        ["Interview Preparation", "Practice Questions"].includes(
            resource.resource_type
        )
    );

    const notesResources = resources.filter(
        (resource) => resource.resource_type === "Study Notes"
    );

    const categories = [
        {
            id: "interview",
            title: "Java Interview Questions",
            label: "INTERVIEW PREPARATION",
            description:
                "Prepare for Java interviews with basic questions, OOPs, Collections, Multithreading and more.",
            resources: interviewResources,
        },
        {
            id: "notes",
            title: "Core Java Notes",
            label: "STUDY NOTES",
            description:
                "Learn Java fundamentals, OOP concepts, Collections, Exception Handling and other important topics.",
            resources: notesResources,
        },
    ];

    const activeCategory = categories.find(
        (category) => category.id === selectedCategory
    );

    return (
        <>
            <main className="java-resources">
                <div className="java-hero">
                    <span className="java-tag">
                        FREE LEARNING RESOURCES
                    </span>

                    <h1>
                        {activeCategory
                            ? activeCategory.title
                            : "Java Learning Hub"}
                    </h1>

                    <p>
                        {activeCategory
                            ? activeCategory.description
                            : "Learn Core Java and prepare for your next technical interview. Explore notes and practice important questions to improve your skills."}
                    </p>
                </div>

                {loading && (
                    <div className="java-status">
                        <p>Loading Java resources...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="java-status java-error">
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {activeCategory && (
                            <button
                                type="button"
                                className="java-back-btn"
                                onClick={() => setSelectedCategory(null)}
                            >
                                <FaArrowLeft /> Back to Java Resources
                            </button>
                        )}

                        {!activeCategory ? (
                            // Only TWO category cards
                            <section className="java-grid">
                                {categories.map((category) => (
                                    <article
                                        className="java-card"
                                        key={category.id}
                                    >
                                        <div className="java-icon">
                                            <FaJava />
                                        </div>

                                        <span className="java-category">
                                            {category.label}
                                        </span>

                                        <h2>{category.title}</h2>
                                        <p>{category.description}</p>

                                        <button
                                            type="button"
                                            className="java-download"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    category.id
                                                )
                                            }
                                        >
                                            Explore{" "}
                                            {category.id === "interview"
                                                ? "Questions"
                                                : "Notes"}
                                            <FaExternalLinkAlt />
                                        </button>
                                    </article>
                                ))}
                            </section>
                        ) : (
                            // PDFs for the selected category
                            <section className="java-grid">
                                {activeCategory.resources.length > 0 ? (
                                    activeCategory.resources.map(
                                        (resource) => (
                                            <article
                                                className="java-card"
                                                key={resource.id}
                                            >
                                                <div className="java-icon">
                                                    <FaJava />
                                                </div>

                                                <span className="java-category">
                                                    {resource.resource_type}
                                                </span>

                                                <h2>{resource.title}</h2>

                                                <p>
                                                    {resource.description ||
                                                        "Java learning resource."}
                                                </p>

                                                <a
                                                    className="java-download"
                                                    href={resource.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <FaDownload /> View /
                                                    Download PDF
                                                    {/* <FaExternalLinkAlt /> */}
                                                </a>
                                            </article>
                                        )
                                    )
                                ) : (
                                    <div className="java-status">
                                        <p>
                                            No PDFs available in this category
                                            right now.
                                        </p>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}
