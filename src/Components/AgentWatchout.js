import React, { useContext } from "react";
import { DashboardContext } from "../Context/DashboardContext";
import { Link } from "react-router-dom";
import { avatarImg } from "../Utility/Contants";
import CardComponent from "./CardComponent";

const AgentWatchout = () => {
  const { agentWatchout } = useContext(DashboardContext);
  console.log("agentWatchout", agentWatchout);
  return (
    <>
      {agentWatchout.length > 0 ? (
        <CardComponent title="Agents in watch out list" customWidth="100%">
          <div className="agent-card-wrapper">
            {agentWatchout.map((value, index) => {
              return (
                <Link
                  to={`/agent-watch-out/${value.agent_id}/${value.agent_name}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="agent-each-card">
                    <img
                      src={avatarImg[Math.floor(Math.random() * 10)]}
                      className="avatar-img"
                    />
                    <div className="agent-detail">
                      <h2>{value.agent_id.slice(0, 6)}</h2>
                      <p>{value.agent_name.slice(0, 6)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardComponent>
      ) : (
        <div className="no-data-div">
          <h1>No agent in watch list !</h1>
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            <div className="back-btn">
              <p>{"<"}</p>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default AgentWatchout;
