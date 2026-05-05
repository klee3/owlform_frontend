"use client";

import AppNavbar from "@/components/AppNavbar";
import FormChart from "@/components/FormChart";
import FormHowToDrawer from "@/components/FormHowToDrawer";
import { useDeleteForm } from "@/hooks/api/useDeleteForm";
import { useFormStats } from "@/hooks/api/useFormStats";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type FormStatData = {
  totalSubmissions: number;
  todaySubmissions: number;
  formName?: string;
  createdAt?: string;
};

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon,
  accent = "#1D6AE5",
  delta,
  loading,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
  delta?: { value: string; positive: boolean };
  loading?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
      className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}14` }}
        >
          <Icon icon={icon} width="18" height="18" style={{ color: accent }} />
        </div>
        {delta && !loading && (
          <div
            className={`flex items-center gap-1 text-[11.5px] font-semibold px-2 py-1 rounded-full ${
              delta.positive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            <Icon
              icon={
                delta.positive ? "gravity-ui:arrow-up" : "gravity-ui:arrow-down"
              }
              width="10"
              height="10"
            />
            {delta.value}
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-7 w-20 bg-slate-100 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded-full" />
          </div>
        ) : (
          <>
            <p
              className="text-3xl font-bold text-slate-800 leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="text-[12.5px] text-slate-400 mt-1 font-medium">
              {label}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   DELETE DIALOG
───────────────────────────────────────── */
function DeleteDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  formSlug,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  formSlug: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
          />

          {/* dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-[420px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
          >
            {/* red header stripe */}
            <div className="h-1 bg-gradient-to-r from-red-400 to-rose-500" />

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Icon
                  icon="gravity-ui:trash-bin"
                  width="22"
                  height="22"
                  className="text-red-500"
                />
              </div>

              <h2
                className="text-[18px] font-bold text-slate-800 mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Delete this form?
              </h2>
              <p className="text-[13.5px] text-slate-500 leading-relaxed mb-1">
                This will permanently delete{" "}
                <span className="font-semibold text-slate-700 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">
                  {formSlug}
                </span>{" "}
                and <strong>all its submissions</strong>. This action cannot be
                undone.
              </p>

              <div className="mt-6 flex gap-2.5">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[13.5px] font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isPending}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl text-[13.5px] font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="gravity-ui:trash-bin"
                        width="14"
                        height="14"
                      />
                      Delete forever
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   QUICK ACTION BUTTON
───────────────────────────────────────── */
function QuickAction({
  icon,
  label,
  href,
  onClick,
  variant = "default",
}: {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  const base =
    variant === "danger"
      ? "border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
      : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300";

  const inner = (
    <span
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${base}`}
    >
      <Icon icon={icon} width="15" height="15" />
      {label}
    </span>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <button onClick={onClick}>{inner}</button>;
}

/* ─────────────────────────────────────────
   SKELETON CHART PLACEHOLDER
───────────────────────────────────────── */
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-end gap-3 h-32">
        {[45, 70, 55, 90, 60, 80, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-100 rounded-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="h-2.5 w-6 bg-slate-100 rounded-full" />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const Form = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { workspaceSlug, formSlug } = useParams<{
    workspaceSlug: string;
    formSlug: string;
  }>();

  const {
    data: formStatData,
    isLoading,
    isError,
    error,
  } = useFormStats(workspaceSlug, formSlug);

  const deleteMutation = useDeleteForm();

  useEffect(() => {
    if (error && (error as any)?.code === "ERR_BAD_RESPONSE")
      redirect(`/dashboard/${workspaceSlug}`);
  }, [isError, error]);

  const handleDelete = () => {
    deleteMutation.mutate({ workspaceSlug, formSlug });
  };

  // endpoint URL for display
  const endpointUrl = `https://api.owlform.io/f/${formSlug}`;
  const [copied, setCopied] = useState(false);
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

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        formSlug={formSlug}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 space-y-6">
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-400 mb-4 font-mono">
            <Link
              href={`/dashboard/${workspaceSlug}`}
              className="hover:text-slate-600 transition-colors"
            >
              {workspaceSlug}
            </Link>
            <Icon icon="gravity-ui:chevron-right" width="12" height="12" />
            <span className="text-slate-600 font-semibold">{formSlug}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1D6AE5] flex items-center justify-center shadow-[0_4px_12px_rgba(29,106,229,0.25)]">
                <Icon
                  icon="gravity-ui:file-text"
                  width="20"
                  height="20"
                  className="text-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-2xl font-bold text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {formSlug}
                  </h1>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-slate-400 mt-0.5">
                  Form overview · {workspaceSlug}
                </p>
              </div>
            </div>

            {/* action bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <FormHowToDrawer formSlug={formSlug} />

              <QuickAction
                icon="gravity-ui:list-check"
                label="All submissions"
                href={`/dashboard/${workspaceSlug}/form/${formSlug}/submissions`}
              />

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-[12px] font-mono text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all max-w-[200px] truncate"
              >
                <Icon
                  icon={copied ? "gravity-ui:check" : "gravity-ui:copy"}
                  width="13"
                  height="13"
                  className={copied ? "text-emerald-500 shrink-0" : "shrink-0"}
                />
                <span
                  className={`truncate ${copied ? "text-emerald-600" : ""}`}
                >
                  {copied ? "Copied!" : `…/f/${formSlug}`}
                </span>
              </button>

              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl text-[13.5px] font-semibold transition-all"
              >
                <Icon icon="gravity-ui:trash-bin" width="15" height="15" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total submissions"
            value={formStatData?.totalSubmissions ?? 0}
            icon="gravity-ui:database"
            accent="#1D6AE5"
            loading={isLoading}
            delay={0.05}
          />
          <StatCard
            label="Submitted today"
            value={formStatData?.todaySubmissions ?? 0}
            icon="gravity-ui:calendar"
            accent="#0EA472"
            delta={
              !isLoading && (formStatData?.todaySubmissions ?? 0) > 0
                ? { value: "Today", positive: true }
                : undefined
            }
            loading={isLoading}
            delay={0.1}
          />
          <StatCard
            label="This week"
            value={isLoading ? "—" : "—"}
            icon="gravity-ui:chart-line"
            accent="#7C3AED"
            loading={isLoading}
            delay={0.15}
          />
          <StatCard
            label="Avg. per day"
            value={
              !isLoading && formStatData?.totalSubmissions
                ? Math.round(formStatData.totalSubmissions / 7)
                : 0
            }
            icon="gravity-ui:square-chart-bar"
            accent="#EA580C"
            loading={isLoading}
            delay={0.2}
          />
        </div>

        {/* ── CHART + SIDE PANEL ── */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* chart — takes 2/3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55, ease }}
            className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="text-[15px] font-bold text-slate-800"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Motnly Submissions
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Last 30 days activity
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#1D6AE5] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl font-medium">
                <Icon icon="gravity-ui:calendar" width="12" height="12" />
                30 days
              </div>
            </div>

            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <FormChart workspaceSlug={workspaceSlug} formSlug={formSlug} />
            )}
          </motion.div>

          {/* side info panel — takes 1/3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease }}
            className="flex flex-col gap-4"
          >
            {/* embed endpoint */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon
                    icon="gravity-ui:code"
                    width="14"
                    height="14"
                    className="text-slate-500"
                  />
                </div>
                <p className="text-[13px] font-semibold text-slate-700">
                  Embed endpoint
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11.5px] text-slate-500 break-all leading-relaxed mb-3">
                {endpointUrl}
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl text-[12.5px] font-semibold transition-colors"
              >
                <Icon
                  icon={copied ? "gravity-ui:check" : "gravity-ui:copy"}
                  width="13"
                  height="13"
                />
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>

            {/* quick stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-5 flex-1">
              <p className="text-[13px] font-semibold text-slate-700 mb-4">
                Quick info
              </p>
              <div className="space-y-3">
                {[
                  {
                    label: "Status",
                    value: "Active",
                    valueClass:
                      "text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                  },
                  {
                    label: "Workspace",
                    value: workspaceSlug,
                    valueClass: "text-slate-600 font-mono text-[12px]",
                  },
                  {
                    label: "Form ID",
                    value: formSlug,
                    valueClass: "text-slate-600 font-mono text-[12px]",
                  },
                  {
                    label: "Method",
                    value: "POST",
                    valueClass:
                      "text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono",
                  },
                ].map(({ label, value, valueClass }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[12.5px] text-slate-400">
                      {label}
                    </span>
                    <span className={valueClass}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RECENT ACTIVITY STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease }}
          className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1D6AE5]/10 flex items-center justify-center">
                <Icon
                  icon="gravity-ui:bell"
                  width="15"
                  height="15"
                  className="text-[#1D6AE5]"
                />
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold text-slate-800"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Notifications
                </h3>
                <p className="text-[11.5px] text-slate-400">
                  Get alerted on new submissions
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/${workspaceSlug}/form/${formSlug}/submissions`}
              className="flex items-center gap-1.5 text-[13px] text-[#1D6AE5] font-semibold hover:underline"
            >
              View all
              <Icon icon="gravity-ui:arrow-right" width="13" height="13" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                icon: "gravity-ui:envelope",
                label: "Email alerts",
                desc: "Get an email on every submission",
                connected: true,
              },
              {
                icon: "gravity-ui:logo-slack",
                label: "Slack",
                desc: "Post to a Slack channel instantly",
                connected: false,
              },
              {
                icon: "gravity-ui:plug-connection",
                label: "Webhook",
                desc: "POST to your own endpoint",
                connected: false,
              },
            ].map(({ icon, label, desc, connected }) => (
              <div
                key={label}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  connected
                    ? "border-emerald-100 bg-emerald-50/50"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${connected ? "bg-emerald-100" : "bg-white border border-slate-200"}`}
                >
                  <Icon
                    icon={icon}
                    width="15"
                    height="15"
                    className={
                      connected ? "text-emerald-600" : "text-slate-500"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold text-slate-700">
                      {label}
                    </p>
                    {connected && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full font-semibold">
                        On
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">
                    {desc}
                  </p>
                </div>
                {!connected && (
                  <button className="shrink-0 text-[11.5px] text-[#1D6AE5] font-semibold hover:underline">
                    Setup
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── DANGER ZONE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="bg-white rounded-2xl border border-red-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon
                  icon="gravity-ui:triangle-exclamation"
                  width="17"
                  height="17"
                  className="text-red-500"
                />
              </div>
              <div>
                <p
                  className="text-[14px] font-bold text-slate-800"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Danger zone
                </p>
                <p className="text-[13px] text-slate-500 mt-0.5 max-w-lg">
                  Deleting this form will permanently remove it and all its
                  submissions. This action <strong>cannot be undone</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13.5px] font-semibold transition-colors shadow-[0_2px_8px_rgba(239,68,68,0.25)]"
            >
              <Icon icon="gravity-ui:trash-bin" width="15" height="15" />
              Delete form
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Form;
