import React, { createContext, useState, useEffect } from "react";

export const DashboardContext = createContext();
const DashboardContextWrapper = ({ children }) => {
  const [agentFullReport, setAgentFullReport] = useState([]);
  const [agentIdVal, setAgentIdVal] = useState("");
  const [agentNameVal, setAgentNameVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentWatchout, setAgentWatchout] = useState(
    JSON.parse(localStorage.getItem("agentWatchout"))
      ? JSON.parse(localStorage.getItem("agentWatchout"))
      : []
  );

  useEffect(() => {
    localStorage.setItem("agentWatchout", JSON.stringify(agentWatchout));
  }, [agentWatchout]);

  return (
    <DashboardContext.Provider
      value={{
        agentFullReport,
        setAgentFullReport,
        setAgentIdVal,
        setAgentNameVal,
        agentIdVal,
        agentNameVal,
        setLoading,
        loading,
        agentWatchout,
        setAgentWatchout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextWrapper;
