import React, { useContext, useEffect } from "react";
import CardComponent from "./CardComponent";
import TableComponent from "./TableComponent";
import { DashboardContext } from "../Context/DashboardContext";
import { Link } from "react-router-dom";
import { avatarImg } from "../Utility/Contants";

const LifetimeReport = () => {
  const { agentFullReport, agentIdVal, agentNameVal } =
    useContext(DashboardContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <CardComponent>
        <div className="agent-top-header">
          <Link
            to={`/agent-detail/${agentIdVal}/${agentNameVal}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            <div className="back-btn">
              <p>{"<"}</p>
            </div>
          </Link>
          <img src={avatarImg[5]} className="avatar-img" />
          <h1>#{agentIdVal}</h1>
          <h4>{agentNameVal}</h4>
        </div>
      </CardComponent>

      <div style={{ width: "99%", height: "20%" }}>
        <CardComponent title="Agent lifetime report">
          <div>
            <TableComponent tableRowData={agentFullReport} showHours />
          </div>
        </CardComponent>
      </div>
    </>
  );
};

export default LifetimeReport;
