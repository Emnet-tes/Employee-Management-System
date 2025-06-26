"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d"];

interface Props {
  usedDays: number;
  totalDays: number;
}

const LeaveBalanceChart = ({ usedDays, totalDays }: Props) => {
  const leaveBalanceData = [
    { name: "Used Leave", value: usedDays },
    { name: "Remaining Leave", value: Math.max(totalDays - usedDays, 0) },
  ];

  return (
    <div className="w-2/5 h-72">
      <h1 className="text-lg font-semibold mb-4">Employee Leave Balance</h1>
      <ResponsiveContainer className="bg-white rounded-md shadow-md p-4">
        <PieChart>
          <Pie
            data={leaveBalanceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {leaveBalanceData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fontSize={14}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveBalanceChart;
