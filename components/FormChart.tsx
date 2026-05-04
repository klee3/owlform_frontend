"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

import { useFormChart } from "@/hooks/api/useFormChart";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function FormChart({
  workspaceSlug,
  formSlug,
}: {
  workspaceSlug: string;
  formSlug: string;
}) {
  const { data, isLoading } = useFormChart(workspaceSlug, formSlug);
  console.log(data);
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Form Submissions (Last 30 Days)",
        data: data?.data || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
