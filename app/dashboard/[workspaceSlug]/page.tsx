"use client";

import AppNavbar from "@/components/AppNavbar";
import FormsSection from "@/components/FormSeciont";
import { useWorkspaceStore } from "@/store/workspace.store";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Workspace = {
  slug: string;
  name?: string;
  createdAt?: string;
  formCount?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   AVATAR — generates initials + consistent color from slug
───────────────────────────────────────── */
const PALETTE = [
  ["#1D6AE5", "#EFF6FF"],
  ["#0EA472", "#ECFDF5"],
  ["#7C3AED", "#F5F3FF"],
  ["#EA580C", "#FFF7ED"],
  ["#0891B2", "#ECFEFF"],
  ["#BE185D", "#FDF2F8"],
];

function workspaceColor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++)
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function WorkspaceAvatar({
  slug,
  size = "lg",
}: {
  slug: string;
  size?: "sm" | "lg";
}) {
  const [fg, bg] = workspaceColor(slug);
  const initials = slug.slice(0, 2).toUpperCase();
  const dim = size === "lg" ? "w-12 h-12 text-[16px]" : "w-7 h-7 text-[11px]";
  return (
    <div
      className={`${dim} rounded-2xl flex items-center justify-center font-bold shrink-0`}
      style={{ background: bg, color: fg, fontFamily: "'Sora', sans-serif" }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────
   STAT PILL
───────────────────────────────────────── */
function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-[12px] text-slate-500 font-medium">
      {icon}
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────
   HEADER SKELETON
───────────────────────────────────────── */
function HeaderSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-slate-100" />
      <div className="space-y-2">
        <div className="h-5 w-36 bg-slate-100 rounded-lg" />
        <div className="h-3 w-52 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   WORKSPACE PAGE
───────────────────────────────────────── */
const Workspace = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { workspaces, setActiveWorkspace, activeWorkspace, hydrate } =
    useWorkspaceStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!workspaceSlug || workspaces.length === 0) return;
    const ws = workspaces.find((w) => w.slug === workspaceSlug);
    if (ws) {
      setActiveWorkspace(ws);
      setReady(true);
    }
  }, [workspaceSlug, workspaces, setActiveWorkspace]);

  useEffect(() => {
    async function getWorkspace() {
      hydrate();
    }
    getWorkspace();
  }, []);

  const ws = activeWorkspace as Workspace | null;

  return (
    <div
      className="min-h-screen bg-[#F8F9FC]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`}</style>

      <AppNavbar />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* ── WORKSPACE HEADER ── */}
        {!ready ? (
          <HeaderSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8"
          >
            {/* breadcrumb */}
            <p className="text-[12px] text-slate-400 font-mono mb-4">
              dashboard /{" "}
              <span className="text-slate-600 font-semibold">
                {workspaceSlug}
              </span>
            </p>

            {/* identity row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <WorkspaceAvatar slug={workspaceSlug} size="lg" />
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1
                      className="text-2xl font-bold text-slate-900 tracking-tight leading-tight"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {ws?.name ?? workspaceSlug}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <StatPill
                      icon={
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        </svg>
                      }
                      label={`${ws?.formCount ?? "—"} forms`}
                    />
                    <StatPill
                      icon={
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      }
                      label={
                        ws?.createdAt
                          ? `Created ${new Date(ws.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                          : "Workspace"
                      }
                    />
                    <StatPill
                      icon={
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      }
                      label={workspaceSlug}
                    />
                  </div>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.07 4.93A10 10 0 1 0 4.93 19.07" />
                  </svg>
                  Settings
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl text-[13px] font-semibold transition-colors shadow-[0_2px_8px_rgba(29,106,229,0.22)]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New form
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── DIVIDER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="h-px bg-slate-200 mb-8"
        />

        {/* ── FORMS SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease }}
        >
          <FormsSection workspaceSlug={workspaceSlug} />
        </motion.div>
      </div>
    </div>
  );
};

export default Workspace;
