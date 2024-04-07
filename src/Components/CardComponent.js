import React from "react";
import "../Style/CardComponent.css";

const CardComponent = ({ title, children }) => {
  return (
    <div className="card-wrapper" style={{ width: "100%", height: "100%" }}>
      {title && (
        <div>
          <h3 className="card-title"> {title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default CardComponent;
