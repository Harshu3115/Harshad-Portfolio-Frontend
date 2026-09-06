import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/Footer.css";

import API from "../services/api";

const Footer = () => {

  const [profile, setProfile] = useState(null);

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
          "Failed to load footer profile:",
          error
        );

      }

    };

    fetchProfile();

  }, []);


  return (

    <footer
      className="footer"
      id="contact"
    >

      <div className="container">

        <div className="row g-4 g-lg-5">


          {/* ================= BRAND ================= */}

          <div className="col-12 col-md-6 col-lg-4">

            <div className="footer-brand mb-3">

              <Link to="/">

                <span>
                  &lt;/&gt;
                </span>

                {profile?.name ||
                  "Harshad Shinde"}

              </Link>

            </div>


            <p className="footer-desc">

              {profile?.bio ||
                "Building modern web applications with clean code and great user experience."}

            </p>


            {/* Social Links */}

            <div className="footer-socials d-flex gap-2 flex-wrap">


              {/* GitHub */}

              {profile?.github_url && (

                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                >

                  <i className="fab fa-github"></i>

                </a>

              )}


              {/* LinkedIn */}

              {profile?.linkedin_url && (

                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >

                  <i className="fab fa-linkedin-in"></i>

                </a>

              )}


              {/* Email */}

              {profile?.email && (

                <a
                  href={`mailto:${profile.email}`}
                  title="Email"
                >

                  <i className="fas fa-envelope"></i>

                </a>

              )}

            </div>

          </div>



          {/* ================= QUICK LINKS ================= */}

          <div className="col-6 col-md-3 col-lg-2">

            <h6 className="mb-3">
              Quick Links
            </h6>


            <ul className="footer-links list-unstyled">

              <li>
                <Link to="/about">
                  About
                  <i className="fas fa-chevron-right"></i>
                </Link>
              </li>

              <li>
                <Link to="/skills">
                  Skills
                  <i className="fas fa-chevron-right"></i>
                </Link>
              </li>

              <li>
                <Link to="/projects">
                  Projects
                  <i className="fas fa-chevron-right"></i>
                </Link>
              </li>

              <li>
                <Link to="/experience">
                  Experience
                  <i className="fas fa-chevron-right"></i>
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                  <i className="fas fa-chevron-right"></i>
                </Link>
              </li>

            </ul>

          </div>



          {/* ================= SERVICES ================= */}

          <div className="col-6 col-md-3 col-lg-2">

            <h6 className="mb-3">
              Services
            </h6>


            <ul className="footer-links list-unstyled">

              <li>
                <a href="/contact">
                  Web Development
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>

              <li>
                <a href="/contact">
                  Frontend Development
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>

              <li>
                <a href="/contact">
                  Backend Development
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>

              <li>
                <a href="/contact">
                  API Development
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>

            </ul>

          </div>



          {/* ================= CONNECT ================= */}

          <div className="col-12 col-md-6 col-lg-4">

            <h6 className="mb-3">
              Let's Connect
            </h6>


            <p className="footer-connect-text">

              Have a project in mind or want
              to work together?

            </p>


            {/* Email */}

            {profile?.email && (

              <p className="footer-contact email">
                <i className="fas fa-envelope"></i>

                <a href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>

            )}


            {/* Phone */}

            {profile?.phone && (

              <p className="footer-contact phone">
                <i className="fas fa-phone"></i>

                <a href={`tel:${profile.phone}`}>
                  {profile.phone}
                </a>
              </p>

            )}


            {/* Location */}

            {profile?.location && (

              <p className="footer-contact">
                <i className="fas fa-location-dot"></i>

                <span>
                  {profile.location}
                </span>
              </p>

            )}


            <Link
              to="/contact"
              className="btn-touch d-inline-flex align-items-center"
            >

              Get In Touch

              <i className="fas fa-arrow-right ms-2"></i>

            </Link>

          </div>

        </div>



        {/* ================= BOTTOM BAR ================= */}

        <div className="footer-bottom mt-4 mt-lg-5">

          <div className="row align-items-center text-center text-md-start">

            <div className="col-12 col-md-6 mb-2 mb-md-0">

              <p className="mb-0">

                © {new Date().getFullYear()}{" "}

                {profile?.name ||
                  "Harshad Shinde"}.

                {" "}All rights reserved.

              </p>

            </div>


            <div className="col-12 col-md-6 text-md-end">

              <p className="mb-0">

                Made with ❤️ and lots of ☕

              </p>

            </div>

          </div>

        </div>

      </div>

    </footer>

  );

};

export default Footer;