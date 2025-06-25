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

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col bg-white w-72 p-6 shadow-lg fixed h-full z-20">
      {/* Admin Info */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
          alt="Admin"
          className="w-20 h-20 rounded-full shadow-lg mb-2"
        />
        <span className="font-semibold text-lg text-blue-700">
          Welcome, Admin
        </span>
        <span className="text-xs text-gray-400">Dashboard</span>
      </div>
      {/* Menu */}
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
                }`}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 w-full mt-auto bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-500">
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
