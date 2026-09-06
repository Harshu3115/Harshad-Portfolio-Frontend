import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./Pages/Home";
import AboutPage from "./Pages/AboutPage";
import SkillsPage from "./Pages/SkillsPage";
import ProjectPage from "./Pages/ProjectPage";
import BackToTop from "./components/BackToTop";
import ExperiencePage from "./Pages/ExperiencePage";
import ContactPage from "./Pages/ContactPage";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProjects from "./admin/AdminProjects";
import AdminSkills from "./admin/AdminSkills";
import AdminExperience from "./admin/AdminExperience";
import AdminProfile from "./admin/AdminProfile";
import AdminMessages from "./admin/AdminMessages";
import API from "./services/api";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./admin/ForgotPassword";
import ResetPassword from "./admin/ResetPassword";

const HomeRoute = () => {

  const token = localStorage.getItem("adminToken");

  if (token) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return <Home />;
};


const SessionWatcher = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const handleStorageChange = (event) => {

      if (event.key === "adminToken") {

        // Token removed from another tab
        if (!event.newValue) {

          navigate("/");
        }
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, [navigate]);

  return null;
};

function App() {

  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");


  useEffect(() => {

    const trackVisitor = async () => {

      try {

        await API.post("/visitors");

      } catch (error) {

        console.error(
          "Visitor tracking error:",
          error
        );

      }

    };

    trackVisitor();

  }, []);
  return (
    <>
      <SessionWatcher />
      {!isAdminPage && <Navbar />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route
          path="/experience"
          element={<ExperiencePage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/admin/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminSkills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <AdminExperience />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminPage && <BackToTop />}


    </>
  );
}

export default App;
