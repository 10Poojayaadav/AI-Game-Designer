import { useState } from "react";
import { Menu } from "lucide-react"; 

export default function Sidebar({ steps, currentStep, onSelectStep }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 border-r border-gray-600 shadow-lg p-4 overflow-y-auto rounded-r-xl transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:top-auto md:left-auto  md:h-auto md:block`}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          🧠 <span>Agent Timeline</span>
        </h2>

        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => {
                onSelectStep(index);
                setIsOpen(false); 
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 border-l-4 ${
                index === currentStep
                  ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-500/60 border-transparent hover:border-gray-500"
              }`}
            >
              <span className="truncate block">
                {index + 1}. {step.title}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
