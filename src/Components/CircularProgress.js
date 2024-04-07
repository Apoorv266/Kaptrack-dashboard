import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../Style/CircularProgressBar.css"; // Import CSS for styling

const CircularProgressBar = ({ progress, size, strokeWidth }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentProgress < progress) {
        setCurrentProgress(currentProgress + 1);
      }
    }, 10); // Adjust the interval for smoother animation or faster completion

    return () => clearInterval(interval);
  }, [currentProgress, progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset =
    circumference - (currentProgress / 100) * circumference;

  return (
    <div className="circular-progress-container">
      <svg
        className="circular-progress"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="circular-progress-background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="circular-progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
        />
      </svg>
      <div className="progress-text">{`${currentProgress}%`}</div>
    </div>
  );
};

CircularProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

export default CircularProgressBar;
