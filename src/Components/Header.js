import React from "react";
import "../Style/Header.css";
import { Link } from "react-router-dom";
import { notifyComponent } from "./Toastify";
const Header = () => {
  return (
    <>
      <div className="main-header">
        <h1 style={{ color: "#de1f2c" }}>KapTrack</h1>
        <div className="header-links">
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            <p>Dashboard</p>
          </Link>
          <Link
            to={"/agent-watch-out"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <p>Agent Watch out</p>
          </Link>

          <Link
            to={"/download-agent-report"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <p>Download reports</p>
          </Link>
        </div>
      </div>
      {notifyComponent()}
    </>
  );
};

export default Header;
