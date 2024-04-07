import React, { useEffect, useState } from "react";
import "../Style/AgentCardComponent.css";
import { Link } from "react-router-dom";
import { avatarImg } from "../Utility/Contants";

const AgentCardComponent = () => {
  const [tableRowData, setTableRowData] = useState([]);

  useEffect(() => {
    const url = `http://node.kapture.cx/kap-track/get-all-agents`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTableRowData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);
  return (
    <>
      {tableRowData.length > 0 ? (
        <div className="agent-card-wrapper">
          {tableRowData.map((tableItem, index) => {
            return (
              <Link
                to={`/agent-detail/${tableItem.agent_id}/${tableItem.agent_name}`}
                style={{ textDecoration: "none" }}
              >
                <div className="agent-each-card">
                  <img
                    src={avatarImg[Math.floor(Math.random() * 10)]}
                    className="avatar-img"
                  />
                  <div className="agent-detail">
                    <h2>{tableItem.agent_id.slice(0, 6)}</h2>
                    <p>{tableItem.agent_name.slice(0, 6)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h4 style={{ color: "white" }}>No Agent data available!</h4>
      )}
    </>
  );
};

export default AgentCardComponent;
