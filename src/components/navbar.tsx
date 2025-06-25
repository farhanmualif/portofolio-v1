import { useState } from "react";

export default function Navbar() {
  const menus = [
    { id: 1, text: "About" },
    { id: 2, text: "Project" },
    { id: 3, text: "Contact" },
  ];

  const [activeId, setActiveId] = useState<number>();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <nav className="w-full">
      <ul className="list-none space-y-6 text-center">
        {menus.map((menu) => (
          <li
            key={menu.id}
            className="relative group"
            onClick={() => setActiveId(menu.id)}
            onMouseEnter={() => setHoveredId(menu.id)}
            onMouseLeave={() => setHoveredId(null)}>
            <a
              href={`#${menu.text.toLowerCase()}`}
              className={`px-8 py-2 text-lg font-medium transition-colors duration-300
                ${
                  activeId === menu.id || hoveredId === menu.id
                    ? "text-white"
                    : "text-blue-gray-300 hover:text-white"
                }`}>
              {menu.text}
            </a>
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out
                ${
                  activeId === menu.id || hoveredId === menu.id
                    ? "w-16 opacity-100"
                    : "w-0 opacity-0"
                }`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
