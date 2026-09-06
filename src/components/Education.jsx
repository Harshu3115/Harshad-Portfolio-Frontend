import { FaGraduationCap } from "react-icons/fa";
import "../css/Education.css"

const Education = () => {
    return (
        <div className="education-section">

            <div className="side-title">
                <div className="side-title-icon">
                    <FaGraduationCap />
                </div>
                Education
            </div>

            <div className="education-grid">

                {/* SSC */}
                <div className="edu-card">
                    <div className="edu-year">
                        2019 - 2020
                    </div>

                    <div className="edu-degree">
                        SSC
                    </div>

                    <div className="edu-school">
                        Shree Siddhanath High School
                    </div>

                    <div className="edu-score">
                        83.50%
                    </div>
                </div>

                {/* HSC */}
                <div className="edu-card">
                    <div className="edu-year">
                        2020 - 2022
                    </div>

                    <div className="edu-degree">
                        HSC
                    </div>

                    <div className="edu-school">
                        Maharashtra State Board
                    </div>

                    <div className="edu-score">
                        64.50%
                    </div>
                </div>

                {/* BTech */}
                <div className="edu-card">
                    <div className="edu-year">
                        2022 - 2026
                    </div>

                    <div className="edu-degree">
                        B.Tech CSE
                    </div>

                    <div className="edu-school">
                        DBATU, Lonere
                    </div>

                    <div className="edu-score">
                        CGPA: 7.05
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Education;
