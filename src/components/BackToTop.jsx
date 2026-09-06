import { useEffect, useState } from "react";
import "../css/BackToTop.css"

const BackToTop = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <button
                    className="back-to-top-btn"
                    onClick={scrollToTop}
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            )}
        </>
    );
};

export default BackToTop;
