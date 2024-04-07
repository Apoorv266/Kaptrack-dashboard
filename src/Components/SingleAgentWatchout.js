import React, { useContext, useEffect, useState } from "react";
import {
  calculateProductivityForWatchList,
  getLineGraphData,
  getWatchBarChartData,
  secondsToString,
} from "../Utility/UtilityFunction";
import { DashboardContext } from "../Context/DashboardContext";
import { Link, useParams } from "react-router-dom";
import CardComponent from "./CardComponent";
import "../Style/SingleAgentWatchout.css";
import { avatarImg } from "../Utility/Contants";
import Loader from "./Loader";
import BarChart from "./Charts/BarChart";
import DoubleLineGraph from "./Charts/DoubleLineGraph";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SingleAgentWatchout = () => {
  const { agentId, agentName } = useParams();
  const [agentWatchoutData, setAgentWatchoutData] = useState([]);

  const { loading, setLoading } = useContext(DashboardContext);
  const [dateArr, setDateArr] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [currData, setCurrData] = useState();
  const [barChartData, setBarChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});

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
        setAgentWatchoutData(calculateProductivityForWatchList(data));
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
  function getProdIncrease(diff) {
    const sign = Math.sign(diff);
    if (sign === 0) {
      return <span style={{ color: "white" }}>increased by 0s</span>;
    } else if (sign === -1) {
      return (
        <span style={{ color: "red" }}>
          decreased by {secondsToString(Math.abs(diff))}
        </span>
      );
    } else {
      return (
        // Added return statement here
        <span style={{ color: "green" }}>
          increased by {secondsToString(Math.abs(diff))}
        </span>
      );
    }
  }

  function getUnProdIncrease(diff) {
    if (Math.sign(diff) === 0) {
      return <span style={{ color: "white" }}>increased by 0s</span>;
    } else if (Math.sign(diff) === -1) {
      return (
        <span style={{ color: "green" }}>
          decreased by {secondsToString(Math.abs(diff))}
        </span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>
          increased by {secondsToString(Math.abs(diff))}
        </span>
      );
    }
  }

  const getProdCentTxt = (cent) => {
    if (Math.sign(cent) === 0) {
      return <span style={{ color: "white" }}>increased by 0</span>;
    } else if (Math.sign(cent) === -1) {
      return (
        <span style={{ color: "red" }}>decreased by {Math.abs(cent)}%</span>
      );
    } else {
      return (
        <span style={{ color: "green" }}>increased by {Math.abs(cent)}%</span>
      );
    }
  };

  const getUnprodCentTxt = (cent) => {
    if (Math.sign(cent) === 0) {
      return <span style={{ color: "white" }}>increased by 0</span>;
    } else if (Math.sign(cent) === -1) {
      return (
        <span style={{ color: "green" }}>decreased by {Math.abs(cent)}%</span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>increased by {Math.abs(cent)}%</span>
      );
    }
  };

  useEffect(() => {
    setDateArr(Object.keys(agentWatchoutData));
    setSelectedDate(Object.keys(agentWatchoutData)[0]);
    setBarChartData(getWatchBarChartData(agentWatchoutData));
    setLineChartData(getLineGraphData(agentWatchoutData));
  }, [agentWatchoutData]);

  useEffect(() => {
    setCurrData(agentWatchoutData[selectedDate]);
    setBarChartData(getWatchBarChartData(agentWatchoutData));
    setLineChartData(getLineGraphData(agentWatchoutData));
  }, [selectedDate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <CardComponent>
            <div className="agent-top-header">
              <Link
                to={"/agent-watch-out"}
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="back-btn">
                  <p>{"<"}</p>
                </div>
              </Link>
              <img src={avatarImg[5]} className="avatar-img" />
              <h1>#{agentId}</h1>
              <h4>{agentName}</h4>
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

          <div className="agent-watch-top-card">
            <div style={{ width: "80%", height: "100%" }}>
              <CardComponent>
                <div>
                  <h4 style={{ color: "white" }}>
                    Total productive time Today :{" "}
                    {currData?.productive
                      ? secondsToString(currData?.productive)
                      : "0s"}
                  </h4>
                  <h4 style={{ marginTop: "10px" }}>
                    <span style={{ color: "white" }}>Productive time is </span>
                    {getProdIncrease(currData?.prod_diff)}{" "}
                    <span style={{ color: "white" }}>since yesterday </span>
                  </h4>
                </div>
              </CardComponent>
            </div>

            <div style={{ width: "80%", height: "100%" }}>
              <CardComponent>
                <div>
                  <h4 style={{ color: "white" }}>
                    Total unproductive time Today :{" "}
                    {currData?.unproductive
                      ? secondsToString(currData?.unproductive)
                      : "0s"}
                  </h4>
                  <h4 style={{ marginTop: "10px" }}>
                    <span style={{ color: "white" }}>
                      Unproductive time is{" "}
                    </span>
                    {getUnProdIncrease(currData?.unprod_diff)}{" "}
                    <span style={{ color: "white" }}>since yesterday </span>
                  </h4>
                </div>
              </CardComponent>
            </div>
          </div>

          <div className="agent-watch-circle">
            <div style={{ height: "auto", width: "70%", position: "relative" }}>
              <CardComponent
                title="Productive time percentage change since yesterday"
                customWidth="100%"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  >
                    <CircularProgressbar
                      value={Math.abs(currData?.productiveCent)}
                      text={`${Math.abs(currData?.productiveCent)}%`}
                    />
                  </div>{" "}
                  <h4 style={{ color: "white" }}>
                    {" "}
                    Productive time {getProdCentTxt(
                      currData?.productiveCent
                    )}{" "}
                    since yesterday
                  </h4>
                </div>
              </CardComponent>
            </div>

            <div style={{ height: "auto", width: "70%", position: "relative" }}>
              <CardComponent
                title="Productive time percentage change since yesterday"
                customWidth="100%"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  >
                    <CircularProgressbar
                      value={Math.abs(currData?.unproductiveCent)}
                      text={`${Math.abs(currData?.unproductiveCent)}%`}
                    />
                  </div>{" "}
                  <h4 style={{ color: "white" }}>
                    {" "}
                    Unproductive time{" "}
                    {getUnprodCentTxt(currData?.unproductiveCent)} since
                    yesterday
                  </h4>
                </div>
              </CardComponent>
            </div>
          </div>

          <div style={{ width: "99%", height: "20%" }}>
            <CardComponent title="Net productivity over a week">
              <BarChart
                dataVal={barChartData?.data}
                labels={barChartData?.label}
                label={"Net productivity"}
              />
            </CardComponent>
          </div>

          <div style={{ width: "99%", height: "20%" }}>
            <CardComponent title="Productive vs unproductive time over a week">
              <DoubleLineGraph
                labels={lineChartData?.label}
                data1={lineChartData?.data1}
                data2={lineChartData?.data2}
              />
            </CardComponent>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleAgentWatchout;
