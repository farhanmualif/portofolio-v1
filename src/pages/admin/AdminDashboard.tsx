import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import PersonalInfo from "./PersonalInfo";
import MyProject from "./MyProject";
import Skill from "./Skill";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosConfig";
import AdminSidebar from "../../components/admin/admin-sidebar";
import AdminSidebarMobile from "../../components/admin/mobile-sidebar";

const fetchSkills = () =>
  axiosInstance.get("/api/skill").then((res) => res.data.data);
const fetchProjects = () =>
  axiosInstance.get("/api/project").then((res) => res.data.data);
const fetchPersonalInfo = () =>
  axiosInstance.get("/api/personal-info").then((res) => res.data.data);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch semua data paralel
    queryClient.prefetchQuery({ queryKey: ["skills"], queryFn: fetchSkills });
    queryClient.prefetchQuery({
      queryKey: ["projects"],
      queryFn: fetchProjects,
    });
    queryClient.prefetchQuery({
      queryKey: ["personalInfo"],
      queryFn: fetchPersonalInfo,
    });
  }, [queryClient]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* Sidebar for mobile */}
      <div className="md:hidden">
        <button
          className="m-4 p-2 bg-blue-600 text-white rounded shadow"
          onClick={() => setSidebarOpen(true)}>
          <FaBars size={22} />
        </button>
        <AdminSidebarMobile
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-4 md:p-10 bg-transparent min-h-screen">
        <div className="bg-white p-4 md:p-10 rounded-2xl">
          <Routes>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="my-project" element={<MyProject />} />
            <Route path="skill" element={<Skill />} />
            <Route path="/" element={<Navigate to="personal-info" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
