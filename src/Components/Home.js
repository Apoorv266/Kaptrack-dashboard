import React, { useContext, useEffect, useState } from "react";
import CardComponent from "./CardComponent";
import AgentCardComponent from "./AgentCardComponent";
import {
  getTopAgents,
  teamProductivityFunction,
} from "../Utility/UtilityFunction";
import "../Style/Home.css";
import TopProductiveTab from "./TopProductiveTab";
import CircularProgressBar from "./CircularProgress";
import { DashboardContext } from "../Context/DashboardContext";
import Loader from "./Loader";

const Home = () => {
  const [topAgent, setTopAgent] = useState([]);
  const [teamProductiveStats, setTeamProductiveStats] = useState({});
  const { loading, setLoading } = useContext(DashboardContext);
  useEffect(() => {
    setLoading(true);
    const url = `http://node.kapture.cx/kap-track/get-all-history`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTopAgent(getTopAgents(data));
        setTeamProductiveStats(teamProductivityFunction(data));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  console.log("allHistory", teamProductiveStats);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="header-Cards">
            <div style={{ height: "auto", width: "99%", position: "relative" }}>
              <CardComponent
                title="Team productivity Rate today"
                customWidth="100%"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <CircularProgressBar
                    progress={teamProductiveStats.productivePercentage}
                    size={200}
                    strokeWidth={20}
                  />
                </div>
              </CardComponent>
            </div>

            <div style={{ height: "auto", width: "99%", position: "relative" }}>
              <CardComponent
                title="Team unproductivity Rate today"
                customWidth="100%"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <CircularProgressBar
                    progress={Math.floor(
                      teamProductiveStats.unproductivePercentage
                    )}
                    size={200}
                    strokeWidth={20}
                  />
                </div>
              </CardComponent>
            </div>

            <div style={{ height: "100%", width: "100%" }}>
              <CardComponent
                title="Top productive agents today"
                customWidth="100%"
              >
                <TopProductiveTab topAgent={topAgent} />
              </CardComponent>
            </div>
          </div>
          <div>
            <CardComponent title="All Agent Details" customWidth="100%">
              <AgentCardComponent />
            </CardComponent>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
