"use client";

import { Form } from "@/hooks/api/types";
import { axiosClient } from "@/lib/api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CreateFormDialog from "./CreateFormDialog";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Props = { workspaceSlug: string };
const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   ACCENT COLOR — deterministic from slug
───────────────────────────────────────── */
const ACCENTS = [
  { fg: "#1D6AE5", bg: "#EFF6FF", border: "#BFDBFE" },
  { fg: "#0EA472", bg: "#ECFDF5", border: "#A7F3D0" },
  { fg: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  { fg: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" },
  { fg: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC" },
  { fg: "#BE185D", bg: "#FDF2F8", border: "#FBCFE8" },
];

function accentForSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = slug.charCodeAt(i) + ((h << 5) - h);
  return ACCENTS[Math.abs(h) % ACCENTS.length];
}

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-slate-100" />
        <div className="w-16 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="h-4 w-3/5 bg-slate-100 rounded-lg mb-2" />
      <div className="h-3 w-4/5 bg-slate-100 rounded-full mb-1" />
      <div className="h-3 w-2/5 bg-slate-100 rounded-full" />
      <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
        <div className="h-3 w-20 bg-slate-100 rounded-full" />
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      {/* illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1D6AE5"
            strokeWidth="1.5"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        {/* decorative dots */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1D6AE5]/20" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-blue-200" />
      </div>

      <h3
        className="text-[18px] font-bold text-slate-800 mb-2"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        No forms yet
      </h3>
      <p className="text-[14px] text-slate-500 max-w-xs leading-relaxed mb-7">
        Create your first form to start collecting responses. It takes less than
        a minute.
      </p>

      <CreateFormDialog
        triggerText="Create your first form"
        workspaceSlug={workspaceSlug}
        onCreated={() => window.location.reload()}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FORM CARD
───────────────────────────────────────── */
function FormCard({
  form,
  workspaceSlug,
  index,
}: {
  form: Form;
  workspaceSlug: string;
  index: number;
}) {
  const router = useRouter();
  const accent = accentForSlug(form.slug ?? form.name);
  const initials = form.name.slice(0, 2).toUpperCase();

  // TODO: Get Submission
  const submissionsLabel =
    typeof form.submissionCount === "number"
      ? `${form.submissionCount.toLocaleString()} submission${form.submissionCount !== 1 ? "s" : ""}`
      : null;

  const createdLabel = form.createdAt
    ? new Date(form.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease }}
      onClick={() =>
        router.push(`/dashboard/${workspaceSlug}/form/${form.slug}`)
      }
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* top accent stripe — subtle on idle, vivid on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: accent.fg }}
      />

      <div className="p-5">
        {/* card header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{
              background: accent.bg,
              color: accent.fg,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {initials}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-400 font-medium">
              Active
            </span>
          </div>
        </div>

        {/* name */}
        <h3
          className="text-[15px] font-bold text-slate-800 mb-1 leading-snug group-hover:text-[#1D6AE5] transition-colors duration-200 line-clamp-1"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {form.name}
        </h3>

        {/* description */}
        {form.description ? (
          <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {form.description}
          </p>
        ) : (
          <p className="text-[12.5px] text-slate-300 italic mb-4">
            No description
          </p>
        )}

        {/* footer meta */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            {submissionsLabel && (
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                {submissionsLabel}
              </div>
            )}
            {createdLabel && (
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {createdLabel}
              </div>
            )}
          </div>

          {/* arrow — appears on hover */}
          <span className="text-slate-300 group-hover:text-[#1D6AE5] group-hover:translate-x-0.5 transition-all duration-200">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function FormsSection({ workspaceSlug }: Props) {
  const [search, setSearch] = useState("");

  const {
    data: forms = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Form[]>({
    queryKey: ["forms", workspaceSlug],
    queryFn: async () => {
      const res = await axiosClient.get(`/form/${workspaceSlug}`, {
        withCredentials: true,
      });
      return res.data ?? [];
    },
    enabled: !!workspaceSlug,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return forms;
    const q = search.toLowerCase();
    return forms.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.slug?.toLowerCase().includes(q),
    );
  }, [forms, search]);

  const showEmpty = !isLoading && forms.length === 0;
  const showNoResults = !isLoading && forms.length > 0 && filtered.length === 0;

  return (
    <div className="space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`}</style>

      {/* ── TOOLBAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2
            className="text-[18px] font-bold text-slate-800 tracking-tight leading-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Forms
          </h2>
          {!isLoading && (
            <p className="text-[12.5px] text-slate-400 mt-0.5">
              {forms.length} form{forms.length !== 1 ? "s" : ""} in this
              workspace
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* search */}
          {forms.length > 0 && (
            <div className="relative">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search forms…"
                className="pl-9 pr-4 py-2.5 text-[13px] bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D6AE5]/20 focus:border-[#1D6AE5] transition-all w-52 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              />
            </div>
          )}

          {/* refresh */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center w-10 h-10 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] disabled:opacity-50"
            title="Refresh"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              className={isFetching ? "animate-spin" : ""}
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>

          {/* create */}
          <CreateFormDialog
            triggerText="New form"
            workspaceSlug={workspaceSlug}
            onCreated={() => refetch()}
          />
        </div>
      </motion.div>

      {/* ── CONTENT ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {/* loading skeletons */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skel-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}

          {/* empty workspace */}
          {showEmpty && <EmptyState workspaceSlug={workspaceSlug} />}

          {/* no search results */}
          {showNoResults && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center py-16 text-center"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.75"
                className="mb-3"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-[14px] font-semibold text-slate-500 mb-1">
                No forms match "<span className="text-slate-700">{search}</span>
                "
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-[13px] text-[#1D6AE5] hover:underline font-medium mt-1"
              >
                Clear search
              </button>
            </motion.div>
          )}

          {/* form cards */}
          {!isLoading &&
            filtered.map((form, i) => (
              <FormCard
                key={form.id}
                form={form}
                workspaceSlug={workspaceSlug}
                index={i}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* background refetch indicator */}
      <AnimatePresence>
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-[12.5px] font-medium rounded-full shadow-lg z-30"
          >
            <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Refreshing forms…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
