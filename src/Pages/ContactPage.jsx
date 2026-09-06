import { FaPaperPlane, FaArrowRight } from "react-icons/fa";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";


import "../css/ContactPage.css";
import { Link } from "react-router-dom";

const ContactPage = () => {
    return (
        <>
            <ContactForm />
            <div
                className="cta-banner reveal container"
                style={{ transitionDelay: ".25s" }}
            >
                <div className="cta-icon-wrap">
                    <FaPaperPlane />
                </div>

                <div className="cta-text">
                    <h3>Let's build something amazing together!</h3>

                    <p>
                        I'm excited to hear about your ideas and
                        bring them to life.
                    </p>
                </div>

                <Link href="/contact" className="btn-hire-outline">
                    Hire Me <FaArrowRight />
                </Link>
            </div>
            <br />
            <Footer />
        </>
    );
};

export default ContactPage;
