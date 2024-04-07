import React from "react";
import { Line } from "react-chartjs-2";

const DoubleLineGraph = ({ labels, data1, data2 }) => {
  // Sample data for two lines
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Productive time in seconds",
        data: data1,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Unproductive time in seconds",
        data: data2,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "500px",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default DoubleLineGraph;
