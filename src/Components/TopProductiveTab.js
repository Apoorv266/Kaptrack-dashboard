import React from "react";
import { secondsToString } from "../Utility/UtilityFunction";
import "../Style/TopProductiveTab.css";
import { Link } from "react-router-dom";
import { avatarImg } from "../Utility/Contants";

const TopProductiveTab = ({ topAgent }) => {
  return (
    <div className="top-agent-wrapper">
      {topAgent.length > 0 ? (
        topAgent?.map((item, index) => {
          return (
            <div key={index} className="top-agent-tab">
              <div className="top-agent-img">
                <img
                  src={avatarImg[Math.floor(Math.random() * 10)]}
                  className="avatar-img"
                />
                <div>
                  <p>{item.agent_id}</p>
                  <p>{item.agent_name}</p>
                </div>
              </div>
              <p>
                Productive Hours : {secondsToString(item.total_active_time)}
              </p>

              <Link
                to={`/agent-detail/${item.agent_id}/${item.agent_name}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="back-btn">
                  <p>{">"}</p>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <h4 style={{ color: "white" }}>No agents for today!</h4>
      )}
    </div>
  );
};

export default TopProductiveTab;
