import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CardComponent from "./CardComponent";
import "../Style/SingleAgentTab.css";
import PieChart from "./Charts/PieChart";
import {
  calculateEngagementRate,
  calculateProductivity,
  generatePieChartData,
  getTopVisitedWebsitesTableData,
  wordMapFunc,
} from "../Utility/UtilityFunction";
import BarChart from "./Charts/BarChart";
import DonutChart from "./Charts/DonutChart";
import ReactWordcloud from "react-wordcloud";
import TableComponent from "./TableComponent";
import { DashboardContext } from "../Context/DashboardContext";
import Loader from "./Loader";
import { avatarImg } from "../Utility/Contants";
import closeEye from "../assets/closeEye.png";
import openEye from "../assets/openEye.png";
import { notifySuccess } from "./Toastify";

const SingleAgentTab = () => {
  const { agentId, agentName } = useParams();
  const [agentData, setAgentData] = useState([]);

  const [top10Sites, setTop10Sites] = useState({});
  const [productiveStats, setProductiveStats] = useState({});
  const [engagementRate, setEngagementRate] = useState({});
  const [wordMapData, setWordMapData] = useState([]);

  const [dateArr, setDateArr] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dateArr[0]);
  const navigate = useNavigate();
  const {
    setAgentFullReport,
    setAgentNameVal,
    setAgentIdVal,
    setLoading,
    loading,
    setAgentWatchout,
    agentWatchout,
  } = useContext(DashboardContext);

  const colors = ["#FF6384", "#36A2EB", "#FFCE56"];

  useEffect(() => {
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
        setDateArr(dateArr);
        setSelectedDate(dateArr[0]);
        setAgentData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const currDateData = agentData.filter(
    (item) => item.date.slice(0, 10) === selectedDate
  );

  const checkWatchAgent = agentWatchout.some(
    (item) => item.agent_id === agentId
  );

  useEffect(() => {
    setTop10Sites(generatePieChartData(currDateData, 10));
  }, [selectedDate]);

  useEffect(() => {
    setTop10Sites(generatePieChartData(currDateData, 10));
    setProductiveStats(calculateProductivity(currDateData));
    setEngagementRate(calculateEngagementRate(currDateData));
    setWordMapData(wordMapFunc(currDateData));
  }, [selectedDate]);

  const size0 = 17;

  const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    rotations: 0,
    fontFamily: "impact",
    fontSizes: [size0, size0 * 4, size0 * 6, size0 * 8, size0 * 12],
    transitionDuration: 1000,
    enableTooltip: true,
    tooltipTextColor: "white",
    fontWeight: "normal",
    padding: 1,
  };

  const lifeTimeReportFunc = () => {
    setAgentFullReport(agentData);
    setAgentNameVal(agentName);
    setAgentIdVal(agentId);
    navigate(`/agent-complete-report/${agentId}/${agentName}`);
  };

  const handleAgentWatchFunc = () => {
    const agentWatchArr = [...agentWatchout];
    const check = agentWatchout.some((item) => item.agent_id === agentId);

    if (check) {
      const newData = agentWatchArr.filter((item) => item.agent_id !== agentId);
      setAgentWatchout(newData);
      notifySuccess("Agent successfully removed from watchlist !");
    } else {
      agentWatchArr.push({ agent_id: agentId, agent_name: agentName });
      setAgentWatchout(agentWatchArr);
      notifySuccess("Agent successfully added to watchlist !");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {currDateData.length > 0 ? (
            <div>
              <CardComponent>
                <div className="agent-top-header">
                  <Link
                    to={"/"}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <div className="back-btn">
                      <p>{"<"}</p>
                    </div>
                  </Link>
                  <img src={avatarImg[5]} className="avatar-img" />
                  <h1>#{agentId}</h1>
                  <h4>{agentName}</h4>
                  <div onClick={handleAgentWatchFunc}>
                    {checkWatchAgent ? (
                      <img src={openEye} className="watchout-icon" />
                    ) : (
                      <img src={closeEye} className="watchout-icon" />
                    )}
                  </div>
                </div>
              </CardComponent>

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
              </div>
              <div className="agent-graph-component">
                <div>
                  <div style={{ width: "99%", height: "100%" }}>
                    <CardComponent>
                      <h3 style={{ color: "white" }}>
                        Total productive Time :{" "}
                        {productiveStats.productiveSeconds}
                      </h3>
                    </CardComponent>
                  </div>

                  <div style={{ width: "99%", height: "1500%" }}>
                    <CardComponent>
                      <h3 style={{ color: "white" }}>
                        Total Unproductive Time :{" "}
                        {productiveStats.unproductiveSeconds}{" "}
                      </h3>
                    </CardComponent>
                  </div>

                  <div style={{ width: "99%", height: "230px" }}>
                    <CardComponent>
                      <h3 style={{ color: "white", marginTop: "20px" }}>
                        Percentage of Productive Time :{" "}
                        {productiveStats.productiveCent}%
                      </h3>
                      <h3 style={{ color: "white", marginTop: "20px" }}>
                        Percentage of Unproductive Time :{" "}
                        {productiveStats.unproductiveCent}%
                      </h3>
                      <h3 style={{ color: "white", marginTop: "20px" }}>
                        Productivity Ratio : {productiveStats.productivityRatio}
                      </h3>
                      <h3 style={{ color: "white", marginTop: "20px" }}>
                        Time Utilization Rate : {productiveStats.productiveCent}
                        %
                      </h3>
                    </CardComponent>
                  </div>
                </div>

                <div
                  style={{ width: "99%", height: "400px", marginTop: "-17px" }}
                >
                  <CardComponent title="Website Word cloud">
                    <ReactWordcloud words={wordMapData} options={options} />
                  </CardComponent>
                </div>

                <div style={{ width: "99%" }}>
                  <CardComponent title="Top 10 most visited websites">
                    <PieChart
                      data={top10Sites.data}
                      labels={top10Sites.labels}
                    />
                  </CardComponent>
                </div>

                <div
                  style={{ width: "99%", height: "400px", marginTop: "-17px" }}
                >
                  <CardComponent title="Productive vs Unproductive percentage">
                    <DonutChart
                      data={productiveStats.graphData.data}
                      labels={productiveStats.graphData.labels}
                      colors={colors}
                    />
                  </CardComponent>
                </div>
              </div>
              <div style={{ width: "99%", height: "20%" }}>
                <CardComponent title="Engagement Rate of Agent Across websites">
                  <BarChart
                    dataVal={engagementRate.date}
                    labels={engagementRate.labels}
                    label={"Engagement percentage"}
                  />
                </CardComponent>
              </div>

              <div style={{ width: "99%", height: "20%" }}>
                <CardComponent title="Top 10 websites visited by agent">
                  <div>
                    <button
                      className="full-report"
                      onClick={lifeTimeReportFunc}
                    >
                      Show lifetime report for agent
                    </button>

                    <TableComponent
                      tableRowData={getTopVisitedWebsitesTableData(
                        currDateData
                      )}
                    />
                  </div>
                </CardComponent>
              </div>
            </div>
          ) : (
            <div className="no-data-div">
              <h1>No data available !</h1>
              <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
                <div className="back-btn">
                  <p>{"<"}</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SingleAgentTab;
