import { useState } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { HiX, HiMenuAlt3 } from "react-icons/hi";

export default function MainPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${
        isOpen ? "bg-[#0F162B]" : "  bg-[#111C31]"
      }`}>
      {/* Navbar For Mobile */}
      <div className="p-4 flex items-center justify-between text-blue-gray-100">
        <button className="ml-auto" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>
      {/* Sidebar Mobile with transition */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
        <LeftSection />
      </div>
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        // <LeftSection />
      </div>
      {/* Right Section */}

      <div className="flex-1 bg-[#111C31]">
        <RightSection />
      </div>
    </div>
  );
}
