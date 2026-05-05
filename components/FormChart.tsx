"use client";

import { useFormChart } from "@/hooks/api/useFormChart";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function ChartSkeleton() {
  const bars = [38, 55, 42, 70, 58, 85, 62, 78, 50, 90, 67, 74, 48, 60];
  return (
    <div className="animate-pulse">
      <div className="flex items-end gap-2 h-44 px-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-100 rounded-t-sm"
            style={{ height: `${h}%`, opacity: 0.5 + (i / bars.length) * 0.5 }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3 px-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-2.5 w-6 bg-slate-100 rounded-full" />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyChart() {
  return (
    <div className="h-44 flex flex-col items-center justify-center text-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-1">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.75"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <p className="text-[13.5px] font-medium text-slate-500">
        No submission data yet
      </p>
      <p className="text-[12px] text-slate-400">
        Data will appear once your form receives responses.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUMMARY PILL
───────────────────────────────────────── */
function SummaryPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
      <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
      <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
      <span
        className="text-[13px] font-bold text-slate-700"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function FormChart({
  workspaceSlug,
  formSlug,
}: {
  workspaceSlug: string;
  formSlug: string;
}) {
  const { data, isLoading } = useFormChart(workspaceSlug, formSlug);

  const values: number[] = data?.data ?? [];
  const labels: string[] = data?.labels ?? [];

  /* derived stats */
  const stats = useMemo(() => {
    if (!values.length) return null;
    const total = values.reduce((a, b) => a + b, 0);
    const peak = Math.max(...values);
    const peakLabel = labels[values.indexOf(peak)] ?? "—";
    const avg = total / values.length;
    const last = values[values.length - 1] ?? 0;
    const prev = values[values.length - 2] ?? 0;
    const trend = prev === 0 ? null : ((last - prev) / prev) * 100;
    return { total, peak, peakLabel, avg, trend };
  }, [values, labels]);

  /* chart gradient — built inside the dataset callback */
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Submissions",
          data: values,
          borderColor: "#1D6AE5",
          borderWidth: 2.5,
          pointBackgroundColor: "#1D6AE5",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#1D6AE5",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2.5,
          tension: 0.42,
          fill: true,
          backgroundColor: (context: { chart: ChartJS }) => {
            const ctx = context.chart.ctx;
            const { height } = context.chart.chartArea ?? { height: 200 };
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "rgba(29, 106, 229, 0.18)");
            gradient.addColorStop(0.6, "rgba(29, 106, 229, 0.04)");
            gradient.addColorStop(1, "rgba(29, 106, 229, 0)");
            return gradient;
          },
        },
      ],
    }),
    [labels, values],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#94a3b8",
          bodyColor: "#f8fafc",
          borderColor: "rgba(255,255,255,0.06)",
          borderWidth: 1,
          padding: { top: 10, right: 14, bottom: 10, left: 14 },
          cornerRadius: 10,
          displayColors: false,
          titleFont: { size: 11, family: "DM Sans", weight: "bold" as const },
          bodyFont: { size: 16, family: "Sora", weight: "bold" as const },
          callbacks: {
            title: (items: TooltipItem<"line">[]) => items[0]?.label ?? "",
            label: (item: TooltipItem<"line">) =>
              `${item.parsed.y} submission${item.parsed.y !== 1 ? "s" : ""}`,
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: "#94a3b8",
            font: { size: 11, family: "DM Sans" },
            maxRotation: 0,
            padding: 8,
          },
        },
        y: {
          border: { display: false, dash: [4, 4] },
          grid: {
            color: "rgba(148, 163, 184, 0.12)",
            drawTicks: false,
          },
          ticks: {
            color: "#94a3b8",
            font: { size: 11, family: "DM Sans" },
            padding: 10,
            maxTicksLimit: 5,
            stepSize: 1,
            callback: (value: string | number) =>
              Number.isInteger(value) ? value : "",
          },
          beginAtZero: true,
        },
      },
      animation: {
        duration: 900,
        easing: "easeOutQuart" as const,
      },
    }),
    [],
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* summary pills */}
      {!isLoading && stats && (
        <div className="flex flex-wrap gap-2 mb-5">
          <SummaryPill
            label="Total"
            value={stats.total.toLocaleString()}
            accent="#1D6AE5"
          />
          <SummaryPill
            label="Peak day"
            value={`${stats.peak} on ${stats.peakLabel}`}
            accent="#0EA472"
          />
          <SummaryPill
            label="Daily avg"
            value={stats.avg.toFixed(1)}
            accent="#7C3AED"
          />
          {stats.trend !== null && (
            <div
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-semibold ${
                stats.trend >= 0
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : "bg-red-50 border-red-100 text-red-500"
              }`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                {stats.trend >= 0 ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
              {Math.abs(stats.trend).toFixed(0)}% vs yesterday
            </div>
          )}
        </div>
      )}

      {/* chart area */}
      <div className="relative h-44">
        {isLoading ? (
          <ChartSkeleton />
        ) : values.length === 0 ? (
          <EmptyChart />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      {/* x-axis label */}
      {!isLoading && values.length > 0 && (
        <p className="text-center text-[11px] text-slate-400 mt-3 font-medium tracking-wide uppercase">
          Last 30 days
        </p>
      )}
    </div>
  );
}
