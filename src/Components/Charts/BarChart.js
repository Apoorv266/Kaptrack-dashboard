import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ labels, dataVal, label }) => {
  // Sample data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        backgroundColor: "#FFC0CB",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: dataVal,
      },
    ],
  };

  return (
    <div style={{ width: "70%", margin: "auto", height: "400px" }}>
      <Bar
        data={data}
        options={{
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
                color: "white", // Set legend label color to white
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
