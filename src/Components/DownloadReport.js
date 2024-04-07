import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "../Style/DownloadReport.css";
import { DashboardContext } from "../Context/DashboardContext";
import TableComponent from "./TableComponent";
import CardComponent from "./CardComponent";
import Loader from "./Loader";
import { notifySuccess } from "./Toastify";

const DownloadReport = () => {
  const [agentData, setAgentData] = useState([]);
  const [agentInputArr, setAgentInputArr] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [dateArr, setDateArr] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dateArr[0]);
  const { loading, setLoading } = useContext(DashboardContext);
  const [AgentNameData, setAgentNameData] = useState([]);
  const [currData, setCurrData] = useState([]);
  const [showDatePart, setShowDatePart] = useState();
  const [handleGenerateReport, setHandleGenerateReport] = useState(false);

  const handleAgentChange = (e) => {
    setSelectedAgent(e.target.value);
    setShowDatePart(false);
    setHandleGenerateReport(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleGenerateData = () => {
    const data =
      selectedDate === "Lifetime Data"
        ? agentData
        : agentData.filter((item) => item.date.slice(0, 10) === selectedDate);
    setCurrData(data);
    setHandleGenerateReport(true);
  };

  const handleAgentSave = () => {
    const agentId = AgentNameData.find(
      (item) => item.agent_name === selectedAgent
    ).agent_id;
    const url = `http://node.kapture.cx/kap-track/get-agent-history/${agentId}`;
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const dateArr = [
          ...new Set(data.map((item) => item.date.slice(0, 10))),
        ];
        setDateArr(["Lifetime Data", ...dateArr]);
        setSelectedDate("Lifetime Data");
        setAgentData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setLoading(false);
        setShowDatePart(true);
      });
  };

  const handleDownload = () => {
    // flatten object like this {id: 1, title:'', category: ''};
    const rows = currData.map((item) => ({
      "Entry No": item.id,
      "Agent Id": item.agent_id,
      "Agent Name": item.agent_name,
      "Website URL": item.website_url,
      "Active Time": item.active_time,
      "Recorded Data": item.date.slice(0, 10),
    }));

    // create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent data");

    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      [
        "Entry No",
        "Agent Id",
        "Agent Name",
        "Website URL",
        "Active Time",
        "Recorded Data",
      ],
    ]);

    XLSX.writeFile(workbook, `${selectedAgent}_${selectedDate}.xlsx`, {
      compression: true,
    });
    notifySuccess("Report successfully downloaded !");
  };

  useEffect(() => {
    setLoading(true);
    const url = `http://node.kapture.cx/kap-track/get-all-agents`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const agentList = data.map((item) => item.agent_name);
        setAgentInputArr(agentList);
        setSelectedAgent(agentList[0]);
        setAgentNameData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : AgentNameData.length === 0 ? (
        <div className="download-report-wrapper">
          <p>No agent data available !</p>
        </div>
      ) : (
        <div className="download-report-wrapper">
          <h1>Download agent details</h1>
          <div className="date-select-div">
            <label htmlFor="dateSelect">Select Agent name:</label>
            <select
              id="dateSelect"
              value={selectedAgent}
              onChange={handleAgentChange}
            >
              {agentInputArr.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button className="save-btn" onClick={handleAgentSave}>
              Next
            </button>
          </div>

          {agentData.length === 0 && showDatePart === true ? (
            <p>No data select different agent !</p>
          ) : (
            showDatePart === true && (
              <div className="date-select-div">
                <label htmlFor="dateSelect">Select Date:</label>
                <select
                  id="dateSelect"
                  value={selectedDate}
                  onChange={handleDateChange}
                >
                  {dateArr.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
                <button className="save-btn" onClick={handleGenerateData}>
                  Generate Data
                </button>
              </div>
            )
          )}
          {handleGenerateReport && (
            <>
              <button onClick={handleDownload} className="save-btn">
                DOWNLOAD EXCEL
              </button>
              <div style={{ width: "99%", height: "20%" }}>
                <CardComponent title="Top 10 websites visited by agent">
                  <div>
                    <TableComponent tableRowData={currData} showHours />
                  </div>
                </CardComponent>
              </div>
            </>
          )}
        </div>
      )}{" "}
    </>
  );
};

export default DownloadReport;
