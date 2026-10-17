
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

    // Fetch published resources from backend
    const fetchResources = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/java-resources");

            if (response.data?.success) {
                setResources(response.data.data || []);
            } else {
                setError("Unable to load Java resources.");
            }
        } catch (err) {
            console.error("Java Resources API Error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load resources. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Generate categories dynamically from resource_type
    const categories = [
        ...new Set(
            resources
                .map((resource) => resource.resource_type)
                .filter(Boolean)
        ),
    ].map((type) => {
        const categoryResources = resources.filter(
            (resource) => resource.resource_type === type
        );

        return {
            id: type,
            title: type,
            label: type.toUpperCase(),
            description:
                categoryResources[0]?.description ||
                `Explore our ${type} resources and learning materials.`,
            resources: categoryResources,
        };
    });

    const activeCategory = categories.find(
        (category) => category.id === selectedCategory
    );

    return (
        <>
            <main className="java-resources">
                {/* Hero Section */}
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

                {/* Loading State */}
                {loading && (
                    <div className="java-status">
                        <p>Loading Java resources...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="java-status java-error">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchResources}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Main Content */}
                {!loading && !error && (
                    <>
                        {/* Back Button */}
                        {activeCategory && (
                            <button
                                type="button"
                                className="java-back-btn"
                                onClick={() => setSelectedCategory(null)}
                            >
                                <FaArrowLeft />
                                Back to Java Resources
                            </button>
                        )}

                        {/* Dynamic Category Cards */}
                        {!activeCategory ? (
                            <section className="java-grid">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
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
                                                    setSelectedCategory(category.id)
                                                }
                                            >
                                                Explore {category.title}
                                                <FaExternalLinkAlt />
                                            </button>
                                        </article>
                                    ))
                                ) : (
                                    <div className="java-status">
                                        <p>
                                            No Java resources are available right now.
                                        </p>
                                    </div>
                                )}
                            </section>
                        ) : (
                            /* Resources belonging to selected category */
                            <section className="java-grid">
                                {activeCategory.resources.length > 0 ? (
                                    activeCategory.resources.map((resource) => (
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

                                            {resource.file_url ? (
                                                <a
                                                    className="java-download"
                                                    href={resource.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <FaDownload />
                                                    View / Download PDF
                                                </a>
                                            ) : (
                                                <p className="java-error">
                                                    PDF is currently unavailable.
                                                </p>
                                            )}
                                        </article>
                                    ))
                                ) : (
                                    <div className="java-status">
                                        <p>
                                            No PDFs available in this category right now.
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
