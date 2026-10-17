import { useEffect, useState } from "react";
import "../css/CTA_Banner.css";

function Counter({ end }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const duration = 1500;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min(
                (timestamp - startTime) / duration,
                1
            );

            // Smooth ease-out effect
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easedProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end]);

    return <span>{count}</span>;
}


const stats = [
    {
        icon: "fas fa-code",
        number: 10,
        suffix: "+",
        label: "Projects Completed",
    },
    {
        icon: "fas fa-smile",
        number: 100,
        suffix: "%",
        label: "Client Satisfaction",
    },
    {
        icon: "fas fa-trophy",
        number: 1,
        suffix: "+",
        label: "Years Experience",
    },
    {
        icon: "fas fa-rocket",
        text: "Always",
        label: "Learning & Improving",
    },
];

const CTA_Banner = () => {
    return (
        <div className="container">
            <section className="stats-section" id="experience">

                <div className="row text-center gy-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`col-6 col-md-3 stat-item ${index !== 0 ? "stat-divider" : ""
                                }`}
                        >
                            <div className="stat-icon-home">
                                <i className={stat.icon}></i>
                            </div>

                            <div className="stat-num">
                                {stat.text ? (
                                    stat.text
                                ) : (
                                    <>
                                        <Counter end={stat.number} />
                                        {stat.suffix}
                                    </>
                                )}
                            </div>

                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );
};

export default CTA_Banner;
