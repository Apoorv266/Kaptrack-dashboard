import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DonutChart = (props) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: props.labels,
          datasets: [
            {
              data: props.data,
              backgroundColor: props.colors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Added to prevent automatic resizing
          plugins: {
            legend: {
              labels: {
                color: "white", // Set legend label color to white
              },
            },
            title: {
              display: true,
              text: props.title,
              font: {
                size: 18, // Adjust the font size of the title
              },
            },
          },
        },
      });
    }
  }, [props]);

  return (
    <canvas ref={chartContainer} style={{ width: "300px", height: "300px" }} />
  );
};

export default DonutChart;
