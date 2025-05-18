import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar({ steps, currentStep, onSelectStep }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-3 left-3 z-50 p-2 bg-gamePrimary text-gray-300  hover:bg-opacity-90"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-gradient-to-b from-[#2b2d42] via-[#1e213a] to-[#121212] border-r border-gray-700 shadow-xl p-5 font-game overflow-y-auto rounded-r-3xl transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:h-auto md:block`}
      >
        {/* Close Button (only mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            className="text-white p-2 bg-red-500 rounded-full hover:bg-red-600 shadow-lg"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 tracking-wide drop-shadow-md">
          🎮 <span>Agent Timeline</span>
        </h2>

        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => {
                onSelectStep(index);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 text-sm border-l-4 font-semibold ${
                index === currentStep
                  ? "bg-gamePrimary/20 border-gamePrimary text-white"
                  : "text-gray-300 hover:bg-white/10 border-transparent hover:border-white/20"
              }`}
            >
              <span className="truncate block">{step.title}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
