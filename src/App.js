import "./App.css";
import { useContext } from "react";
import { DashboardContext } from "./Context/DashboardContext";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import SingleAgentTab from "./Components/SingleAgentTab";
import LifetimeReport from "./Components/LifetimeReport";
import AgentWatchout from "./Components/AgentWatchout";
import SingleAgentWatchout from "./Components/SingleAgentWatchout";
import DownloadReport from "./Components/DownloadReport";

function App() {
  const { state } = useContext(DashboardContext);
  return (
    <div className="body">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/agent-detail/:agentId/:agentName"
          element={<SingleAgentTab />}
        />
        <Route
          path="/agent-complete-report/:agentId/:agentName"
          element={<LifetimeReport />}
        />

        <Route path="/agent-watch-out" element={<AgentWatchout />} />

        <Route
          path="/agent-watch-out/:agentId/:agentName"
          element={<SingleAgentWatchout />}
        />

        <Route path="/download-agent-report" element={<DownloadReport />} />
      </Routes>
    </div>
  );
}

export default App;
