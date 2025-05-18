import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { agentReasoning } from "../data/mockAgentData";

const Header = ({ status, step }) => {
  console.log("Agent Reasoning Data:", agentReasoning);

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AI Game Designer — Thought Process", 10, 10);

    let y = 20;

    if (!agentReasoning || agentReasoning.length === 0) {
      doc.text("No data to display", 10, y);
    } else {
      agentReasoning.forEach((node, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${node.title}`, 10, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.text(`Description: ${node.description}`, 10, y);
        y += 8;

        doc.text(`Confidence: ${node.confidence.toString()}`, 10, y);
        y += 12;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save("ai_game_designer_steps.pdf");
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(agentReasoning, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "agent_reasoning.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <header className="w-full bg-gradient-to-r from-gray-700 via-gray-700 to-blue-800 text-white shadow p-8 rounded-xl mb-4 border border-gray-700">
      {/* Responsive layout: column on small screens, row on md+ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Center content on mobile */}
        <div className="flex items-center gap-4 justify-center md:justify-start flex-1 min-w-[200px]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712036.png"
            alt="Agent Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold">🎲 AI Game Designer</h1>
            <p className="text-sm text-gray-300">
              Designing a board game in real-time...
            </p>
          </div>
        </div>

        {/* Status + Download in separate corners on small screens */}
        <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4">
          {/* Status badge */}
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium whitespace-nowrap ${
              status === "thinking"
                ? "bg-yellow-100 text-yellow-800"
                : status === "idle"
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status === "thinking"
              ? "🤔 Thinking..."
              : status === "idle"
              ? "💤 Idle"
              : "✅ Complete"}
          </span>

          {/* Download button with tooltip */}
          <div className="relative group">
            <button
              onClick={downloadAsPDF}
              className="p-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700"
            >
              <Download size={20} />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              Download Steps
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
