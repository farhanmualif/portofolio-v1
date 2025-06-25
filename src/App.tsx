import "./App.css";
import { useEffect, useState } from "react";
import { HiArrowDown } from "react-icons/hi2";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import MainPage from "./pages/MainPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthProvider } from "./pages/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/admin/Login";
import CursorParticles from "./components/particle-cursor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [currentSection, setCurrentSection] = useState("about");

  useEffect(() => {
    AOS.init({ duration: 1200 });

    const handleScroll = () => {
      const sections = ["about", "project", "contact"];
      let currentSectionIndex = 0;

      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (
          section &&
          section.getBoundingClientRect().top <= window.innerHeight / 2
        ) {
          currentSectionIndex = i;
        }
      }

      setCurrentSection(sections[currentSectionIndex]);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    const sections = ["about", "project", "contact"];
    const currentSectionIndex = sections.indexOf(currentSection);
    const nextSectionIndex = (currentSectionIndex + 1) % sections.length;
    const nextSection = sections[nextSectionIndex];

    const nextSectionElement = document.getElementById(nextSection);
    if (nextSectionElement) {
      nextSectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CursorParticles />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Route untuk halaman utama */}
            <Route
              path="/"
              element={
                <div className="relative">
                  <MainPage />
                  <div
                    className="fixed bottom-20 right-20 animate-bounce w-10 h-10 bg-white flex justify-center items-center rounded-full cursor-pointer"
                    onClick={handleClick}>
                    <HiArrowDown />
                  </div>
                </div>
              }
            />

            {/* Route untuk login */}
            <Route path="/login" element={<Login />} />

            {/* Route untuk dashboard admin (dilindungi) */}
            <Route element={<ProtectedRoute />}>
              {/* Default route untuk admin */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/personal-info" replace />}
              />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>

            {/* Redirect ke halaman utama jika route tidak ditemukan */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
