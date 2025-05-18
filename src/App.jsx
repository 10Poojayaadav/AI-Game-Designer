import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Visualizer from "./pages/Visualizer";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import { agentReasoning } from "./data/mockAgentData";

function App() {
  const [status, setStatus] = useState("thinking");
  const [step, setStep] = useState(0);
  const [toolFilter, setToolFilter] = useState("all");
  const [minConfidence, setMinConfidence] = useState(0);

  return (
    <>
      <div className="flex">
        <Sidebar
          steps={agentReasoning}
          currentStep={step}
          onSelectStep={setStep}
        />

        <main className="flex-1 p-4 overflow-y-auto">
          <Header
            status={status}
            step={step}
            agentReasoning={agentReasoning.slice(0, step)}
          />
          <Visualizer step={step} setStep={setStep} />
        </main>
      </div>
    </>
  );
}

export default App;
