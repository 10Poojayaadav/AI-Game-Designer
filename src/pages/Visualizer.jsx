import { useRef, useEffect, useState } from "react";
import FlowNode from "../components/FlowNode";
import ReasoningModal from "../components/ReasoningModal";
import { agentReasoning } from "../data/mockAgentData";
import { motion } from "framer-motion";

const Visualizer = ({ step, setStep }) => {
  const nodeRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toolFilter, setToolFilter] = useState("all");
  const [minConfidence, setMinConfidence] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [explainMode, setExplainMode] = useState(false);
  const [narrationType, setNarrationType] = useState("text");

  useEffect(() => {
    let interval;
    if (playing && step < agentReasoning.length) {
      interval = setInterval(() => {
        setStep((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing, step]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.75) return "bg-green-400";
    if (confidence >= 0.5) return "bg-yellow-300";
    if (confidence >= 0.25) return "bg-orange-300";
    return "bg-red-300";
  };

  const explain = () => {
    setExplainMode(true);
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateArrows();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    let interval;
    if (isPlaying && step < agentReasoning.length) {
      interval = setInterval(() => {
        setStep((prevStep) => {
          if (prevStep < agentReasoning.length) {
            return prevStep + 1;
          } else {
            clearInterval(interval);
            setIsPlaying(false);
            return prevStep;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step]);

  useEffect(() => {
    const newLines = [];
    for (let i = 0; i < nodeRefs.current.length - 1; i++) {
      const source = nodeRefs.current[i];
      const target = nodeRefs.current[i + 1];
      if (source && target) {
        const srcBox = source.getBoundingClientRect();
        const tgtBox = target.getBoundingClientRect();
        const containerBox = source.offsetParent.getBoundingClientRect();

        newLines.push({
          x1: srcBox.right - containerBox.left,
          y1: srcBox.top + srcBox.height / 2 - containerBox.top,
          x2: tgtBox.left - containerBox.left,
          y2: tgtBox.top + tgtBox.height / 2 - containerBox.top,
        });
      }
    }
    setLines(newLines);
  }, [step]);

  // 🔊 Narration Logic
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (
      !explainMode ||
      narrationType !== "voice" ||
      step >= agentReasoning.length
    )
      return;

    const current = agentReasoning[step];

    // Cancel previous speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(current.description);
    utteranceRef.current = utterance;

    // After speech ends, go to next step
    utterance.onend = () => {
      if (step + 1 < agentReasoning.length) {
        setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 300); // Optional buffer
      }
    };

    // Speak
    window.speechSynthesis.speak(utterance);

    // Cleanup in case component unmounts or rerenders
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [step, explainMode, narrationType]);

  useEffect(() => {
    if ((explainMode && narrationType === "voice") || !isPlaying) return;

    let interval;
    if (step < agentReasoning.length) {
      interval = setInterval(() => {
        setStep((prevStep) => {
          if (prevStep < agentReasoning.length - 1) {
            return prevStep + 1;
          } else {
            clearInterval(interval);
            return prevStep;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, step, explainMode, narrationType]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 to-white py-10 px-6">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-center text-blue-400 drop-shadow-lg font-game px-4 leading-tight p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{
          scale: 1.03,
          textShadow: "0px 0px 6px rgba(255, 255, 255, 0.8)",
        }}
      >
        🎲 AI Game Designer — Thought Map
      </motion.h1>

      <div className="relative">
        {/* Filters */}
        <div className="grid gap-4 mb-6 bg-white shadow-xl rounded-2xl p-6 border border-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tool Filter */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Tool:
            </label>
            <select
              className="block w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="InitTool">InitTool</option>
              <option value="ThemeGen">ThemeGen</option>
              <option value="GoalGen">GoalGen</option>
              <option value="RuleGen">RuleGen</option>
            </select>
          </div>

          {/* Confidence Range */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Confidence:
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1 text-center">
              Current: {(minConfidence * 100).toFixed(0)}%
            </div>
          </div>

          {/* Narration Mode Controls */}
          <div className="flex flex-col gap-2 justify-center">
            <label className="flex items-center gap-2">
              {/* <input
                type="checkbox"
                checked={explainMode}
                onChange={(e) => setExplainMode(e.target.checked)}
              /> */}
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-md flex items-center gap-2"
                onClick={explain}
                onChange={(e) => setExplainMode(e.target.checked)}
              >
                🎙️ Explain Mode
              </button>
            </label>

            {explainMode && (
              <select
                value={narrationType}
                onChange={(e) => setNarrationType(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="text">📝 Text</option>
                <option value="voice">🔊 Voice</option>
              </select>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center flex-wrap gap-4 mb-6 justify-center">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 transition"
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
          >
            ⏪ Back
          </button>

          <button
            onClick={() =>
              setStep((s) => Math.min(agentReasoning.length, s + 1))
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
          >
            ⏩ Forward
          </button>

          <button
            onClick={() => {
              setStep(0);
              setIsPlaying(false);
            }}
            className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Reset
          </button>

          <div className="text-sm text-gray-700 font-medium">
            Step: {step + 1}/{agentReasoning.length}
          </div>
        </div>

        {/* Node Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-4 relative"
          id="node-container"
        >
          {agentReasoning
            .filter((n) => toolFilter === "all" || n.tool === toolFilter)
            .filter((n) => n.confidence >= minConfidence)
            .filter((_, index) => index <= step)
            .map((node, index) => (
              <motion.div
                key={node.id}
                ref={(el) => (nodeRefs.current[index] = el)}
                className="z-10 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedNode(node)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-2 bg-gray-300 rounded overflow-hidden mt-2">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{ width: `${node.confidence * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${node.confidence * 100}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className="text-xs text-gray-600 text-right mt-1">
                  Confidence: {(node.confidence * 100).toFixed(0)}%
                </div>
                <div
                  className={`rounded-2xl p-4 shadow-md border transition hover:scale-105 duration-300 ${getConfidenceColor(
                    node.confidence
                  )}`}
                >
                  <FlowNode
                    id={`node-${node.id}`}
                    title={node.title}
                    description={node.description}
                    confidence={node.confidence}
                  />
                </div>
              </motion.div>
            ))}

          {/* Arrows */}
          {toolFilter === "all" && !isMobile && (
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
              {lines.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#6366f1"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              ))}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                </marker>
              </defs>
            </svg>
          )}
        </div>
      </div>

      {/* Narration Text Display */}
      {explainMode &&
        narrationType === "text" &&
        step < agentReasoning.length && (
          <div className="mt-8 max-w-3xl mx-auto bg-white rounded-xl p-4 border shadow">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              🧠 AI Explanation
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              {agentReasoning[step].description}
            </p>
          </div>
        )}

      <ReasoningModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
      />

      {/* Step Slider */}
      <div className="w-full max-w-xl mx-auto mt-10">
        <input
          type="range"
          min="0"
          max={agentReasoning.length}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing step {step} of {agentReasoning.length}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
