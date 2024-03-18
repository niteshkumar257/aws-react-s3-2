import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { subjects } from "../../config";

const StepChart = ({ data, subject_id }) => {
  const yAxisTickFormatter = (level) => {
    return `L-${level}`;
  };

  const shiftDataPoints = 1;
  return (
    <div style={{ backgroundColor: "" }}>
      <LineChart
        width={540}
        height={225}
        data={data}
        margin={{ top: 10, right: -10, left: -20, bottom: 0 }} // Adjust margins for better spacing
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          horizontal={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: "black" }}
          padding={{ left: 20, right: 20 }}
          domain={[shiftDataPoints, "auto"]}
          axisLine={{ stroke: "black", strokeWidth: 2 }}
          // Add padding between axis and labels
        />

        <YAxis
          ticks={[0, 1, 2, 3]}
          domain={[0, 3]}
          tickFormatter={yAxisTickFormatter}
          tick={{ fill: "black" }}
          axisLine={{ stroke: "black", strokeWidth: 2 }}
          padding={{ top: 10, bottom: 10 }} // Add padding between axis and labels
        >
          <Label
            value="Levels"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          labelStyle={{ color: "#333", fontWeight: "bold" }}
          itemStyle={{ color: "#8884d8" }}
          formatter={(value, name) => [`${value} units`, ` ${name}`]}
        />
        <Legend />
        <Line
          type="step"
          strokeWidth={3}
          dataKey="level"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default StepChart;
