"use client";

import AppNavbar from "@/components/AppNavbar";
import { axiosClient } from "@/lib/api/axiosClient";
import { Icon } from "@iconify/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Submission = {
  id: number;
  data: Record<string, string | number | boolean | null>;
  createdAt: string;
};

type Meta = {
  page: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

type SubmissionsResponse = {
  data: Submission[];
  meta: Meta;
};

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const LIMIT = 10;
const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

function exportCSV(columns: string[], rows: Submission[], formSlug: string) {
  const header = [...columns, "submitted_at"].join(",");
  const body = rows.map((r) =>
    [
      ...columns.map((c) => `"${String(r.data[c] ?? "").replace(/"/g, '""')}"`),
      `"${r.createdAt}"`,
    ].join(","),
  );
  const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${formSlug}-submissions.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────
   SKELETON ROW
───────────────────────────────────────── */
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <div className="flex gap-4 px-6 py-4 border-b border-slate-100 animate-pulse">
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-slate-100 rounded-full flex-1"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <Icon
          icon="gravity-ui:inbox"
          width="28"
          height="28"
          className="text-[#1D6AE5]"
        />
      </div>
      <h3 className="text-[16px] font-semibold text-slate-700 mb-2">
        No submissions yet
      </h3>
      <p className="text-[13.5px] text-slate-400 max-w-xs leading-relaxed">
        Once someone fills out your form, their responses will appear here in
        real-time.
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon,
  accent = "#1D6AE5",
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}14` }}
      >
        <Icon icon={icon} width="18" height="18" style={{ color: accent }} />
      </div>
      <div>
        <p
          className="text-[22px] font-bold text-slate-800 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {value}
        </p>
        <p className="text-[11.5px] text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const FormSubmissions = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const { workspaceSlug, formSlug } = useParams<{
    workspaceSlug: string;
    formSlug: string;
  }>();

  /* ── React Query ── */
  const { data, isLoading, isError, isFetching } =
    useQuery<SubmissionsResponse>({
      queryKey: ["submissions", workspaceSlug, formSlug, page],
      queryFn: async () => {
        const res = await axiosClient(
          `/form/${workspaceSlug}/${formSlug}/submissions?page=${page}&limit=${LIMIT}`,
        );
        return res.data;
      },
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0].data);
  }, [rows]);

  /* ── Client-side search filter ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) =>
        String(r.data[c] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, search, columns]);

  /* ── Copy endpoint URL ── */
  const endpointUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formSlug}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FC]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`}</style>

      <AppNavbar />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-700 transition-colors mb-5 group"
          >
            <Icon
              icon="gravity-ui:arrow-left"
              width="14"
              height="14"
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to form
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#1D6AE5] flex items-center justify-center">
                  <Icon
                    icon="gravity-ui:file-text"
                    width="14"
                    height="14"
                    className="text-white"
                  />
                </div>
                <p className="text-[12px] text-slate-400 font-medium font-mono">
                  {workspaceSlug} / {formSlug}
                </p>
              </div>
              <h1
                className="text-2xl font-bold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Submissions
              </h1>
            </div>

            {/* endpoint pill + export */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] font-mono"
              >
                <Icon
                  icon={copied ? "gravity-ui:check" : "gravity-ui:copy"}
                  width="13"
                  height="13"
                  className={copied ? "text-emerald-500" : ""}
                />
                <span className={copied ? "text-emerald-600" : ""}>
                  {copied ? "Copied!" : endpointUrl}
                </span>
              </button>
              {rows.length > 0 && (
                <button
                  onClick={() => exportCSV(columns, rows, formSlug)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] font-medium"
                >
                  <Icon
                    icon="gravity-ui:arrow-down-to-line"
                    width="14"
                    height="14"
                  />
                  Export CSV
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1D6AE5] hover:bg-[#1558c7] rounded-xl text-[13px] text-white font-semibold transition-colors shadow-[0_2px_8px_rgba(29,106,229,0.25)]">
                <Icon icon="gravity-ui:bell" width="14" height="14" />
                Notify me
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        {meta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8"
          >
            <StatCard
              label="Total submissions"
              value={meta.total.toLocaleString()}
              icon="gravity-ui:database"
              accent="#1D6AE5"
            />
            <StatCard
              label="This page"
              value={rows.length}
              icon="gravity-ui:list-check"
              accent="#0EA472"
            />
            <StatCard
              label="Total pages"
              value={meta.totalPages}
              icon="gravity-ui:book-open"
              accent="#7C3AED"
            />
            <StatCard
              label="Fields per row"
              value={columns.length || "—"}
              icon="gravity-ui:layout-columns-3"
              accent="#EA580C"
            />
          </motion.div>
        )}

        {/* ── TABLE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.55, ease }}
          className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          {/* toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-3 flex-wrap">
            <div className="relative">
              <Icon
                icon="gravity-ui:magnifier"
                width="14"
                height="14"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search submissions…"
                className="pl-8.5 pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D6AE5]/20 focus:border-[#1D6AE5] transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              {isFetching && !isLoading && (
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <div className="w-3 h-3 border-2 border-[#1D6AE5] border-t-transparent rounded-full animate-spin" />
                  Refreshing
                </div>
              )}
              <div className="text-[12px] text-slate-400">
                {filtered.length > 0 &&
                  `${filtered.length} row${filtered.length !== 1 ? "s" : ""}`}
              </div>
            </div>
          </div>

          {/* column headers */}
          {!isLoading && columns.length > 0 && (
            <div
              className="grid px-6 py-3 text-[10.5px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/60 font-semibold"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, 1fr) 160px`,
              }}
            >
              {columns.map((col) => (
                <span key={col} className="truncate">
                  {col}
                </span>
              ))}
              <span>Submitted at</span>
            </div>
          )}

          {/* content */}
          {isLoading ? (
            <div>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} cols={3} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Icon
                  icon="gravity-ui:triangle-exclamation"
                  width="24"
                  height="24"
                  className="text-red-400"
                />
              </div>
              <p className="text-[15px] font-semibold text-slate-700 mb-1">
                Failed to load submissions
              </p>
              <p className="text-[13px] text-slate-400">
                Check your connection and try again.
              </p>
            </div>
          ) : filtered.length === 0 && search ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon
                icon="gravity-ui:magnifier"
                width="28"
                height="28"
                className="text-slate-300 mb-3"
              />
              <p className="text-[14px] font-medium text-slate-500">
                No results for "<span className="text-slate-700">{search}</span>
                "
              </p>
            </div>
          ) : rows.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((row, i) => {
                const { date, time } = formatDate(row.createdAt);
                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.35, ease }}
                    className="grid px-6 py-4 text-[13px] border-b border-slate-50 hover:bg-blue-50/25 transition-colors cursor-default group"
                    style={{
                      gridTemplateColumns: `repeat(${columns.length}, 1fr) 160px`,
                    }}
                  >
                    {columns.map((col, ci) => (
                      <span
                        key={col}
                        className={`truncate pr-4 ${ci === 0 ? "font-medium text-slate-700" : "text-slate-500"}`}
                        title={String(row.data[col] ?? "")}
                      >
                        {String(
                          row.data[col] ?? (
                            <span className="text-slate-300 italic">—</span>
                          ),
                        )}
                      </span>
                    ))}
                    <span className="text-slate-400 shrink-0">
                      <span className="text-slate-600 font-medium">{date}</span>
                      <span className="text-slate-400 ml-1.5 text-[11.5px]">
                        {time}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* ── PAGINATION ── */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/40">
              <span className="text-[12.5px] text-slate-400">
                Showing {(meta.page - 1) * LIMIT + 1}–
                {Math.min(meta.page * LIMIT, meta.total)} of{" "}
                <span className="font-semibold text-slate-600">
                  {meta.total.toLocaleString()}
                </span>{" "}
                results
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={!meta.hasPrevPage || isFetching}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                >
                  <Icon icon="gravity-ui:arrow-left" width="13" height="13" />
                  Prev
                </button>

                {/* page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(meta.totalPages, 7) },
                    (_, i) => {
                      const p = i + 1;
                      const isCurrent = p === meta.page;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                            isCurrent
                              ? "bg-[#1D6AE5] text-white shadow-[0_2px_8px_rgba(29,106,229,0.25)]"
                              : "text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}
                  {meta.totalPages > 7 && (
                    <>
                      <span className="text-slate-300 px-1">…</span>
                      <button
                        onClick={() => setPage(meta.totalPages)}
                        className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                          meta.page === meta.totalPages
                            ? "bg-[#1D6AE5] text-white"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {meta.totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={!meta.hasNextPage || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Next
                  <Icon icon="gravity-ui:arrow-right" width="13" height="13" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* bottom note */}
        <p className="text-center text-[12px] text-slate-400 mt-6">
          Data refreshes every 30 seconds ·{" "}
          <button
            onClick={() => setPage(1)}
            className="text-[#1D6AE5] hover:underline"
          >
            Refresh now
          </button>
        </p>
      </div>
    </div>
  );
};

export default FormSubmissions;
