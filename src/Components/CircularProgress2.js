import React from "react";

const CircularProgress2 = ({ radius, strokeWidth, progress }) => {
  // Calculate the circumference based on radius
  const circumference = 2 * Math.PI * radius;
  // Calculate the strokeDashoffset based on progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg className="circular-progress" width={radius * 2} height={radius * 2}>
      <circle
        className="progress-ring"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        style={{ strokeDashoffset }}
        r={radius - strokeWidth / 2}
        cx={radius}
        cy={radius}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fontSize="0.8em">
        {`${progress}%`}
      </text>
    </svg>
  );
};

// Set default props
CircularProgress2.defaultProps = {
  radius: 50,
  strokeWidth: 10,
  progress: 0,
};

export default CircularProgress2;
