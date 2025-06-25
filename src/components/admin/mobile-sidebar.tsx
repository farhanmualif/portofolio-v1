import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaProjectDiagram,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    path: "/admin/personal-info",
    label: "Personal Info",
    icon: <FaUser />,
  },
  {
    path: "/admin/my-project",
    label: "My Project",
    icon: <FaProjectDiagram />,
  },
  {
    path: "/admin/skill",
    label: "Skill",
    icon: <FaTools />,
  },
];

interface AdminSidebarMobileProps {
  onLogout: () => void;
  onClose: () => void;
  sidebarOpen: boolean;
}

const AdminSidebarMobile: React.FC<AdminSidebarMobileProps> = ({
  onLogout,
  onClose,
  sidebarOpen,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
      <div className="bg-white w-64 p-6 shadow-2xl h-full flex flex-col">
        <button className="mb-4 text-gray-600 self-end" onClick={onClose}>
          ✕
        </button>
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="Admin"
            className="w-16 h-16 rounded-full shadow mb-2"
          />
          <span className="font-semibold text-lg text-blue-700">Admin</span>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                  onClick={onClose}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full mt-auto bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-500">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default AdminSidebarMobile;
