"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Props = {
  workspaceSlug: string;
  triggerText: string;
  onCreated?: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   SLUG GENERATOR
───────────────────────────────────────── */
function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

/* ─────────────────────────────────────────
   FIELD COMPONENT
───────────────────────────────────────── */
function Field({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[11.5px] text-red-500 flex items-center gap-1.5"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" opacity=".15" />
              <path
                d="M12 8v5M12 16.5h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function CreateFormDialog({
  triggerText,
  workspaceSlug,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slugOverride, setSlugOverride] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  /* auto-derive slug from name unless manually edited */
  const derivedSlug = slugEdited ? slugOverride : toSlug(name);

  /* focus name on open */
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 80);
    }
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* validation */
  const nameError =
    touched.name && !name.trim() ? "Form name is required" : undefined;
  const slugError =
    touched.slug && derivedSlug && !/^[a-z0-9-]+$/.test(derivedSlug)
      ? "Only lowercase letters, numbers, and hyphens"
      : undefined;
  const isValid = name.trim() && !slugError;

  /* reset state */
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setDescription("");
      setSlugOverride("");
      setSlugEdited(false);
      setTouched({});
    }, 300);
  };

  /* submit */
  const handleCreate = async () => {
    setTouched({ name: true, slug: true });
    if (!isValid) return;

    try {
      setLoading(true);
      await axiosClient.post(
        "/form",
        {
          name: name.trim(),
          description: description.trim(),
          workspaceSlug,
          slug: derivedSlug,
        },
        { withCredentials: true },
      );

      toast.success("Form created successfully!");
      handleClose();
      onCreated?.();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? err.message ?? "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  /* submit on Cmd/Ctrl + Enter */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleCreate();
  };

  const charCount = name.length;
  const MAX_NAME = 60;

  return (
    <>
      {/* ── TRIGGER ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl text-[13.5px] font-semibold transition-colors shadow-[0_2px_8px_rgba(29,106,229,0.22)]"
      >
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
        {triggerText}
      </button>

      {/* ── MODAL ── */}
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
              onClick={handleClose}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
            />

            {/* dialog */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.28, ease }}
              onKeyDown={handleKeyDown}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94vw] max-w-[480px] bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.14)] border border-slate-100 overflow-hidden"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`}</style>

              {/* top accent line */}
              <div className="h-[3px] bg-gradient-to-r from-[#1D6AE5] via-[#4F8EF7] to-[#7C3AED]" />

              {/* header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1D6AE5] flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className="text-[16px] font-bold text-slate-900 leading-tight"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      Create new form
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5 font-mono">
                      {workspaceSlug}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* body */}
              <div className="px-6 py-5 space-y-4">
                {/* name */}
                <Field
                  label="Form name"
                  required
                  error={nameError}
                  hint={`${charCount}/${MAX_NAME}`}
                >
                  <div className="relative">
                    <input
                      ref={nameRef}
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value.slice(0, MAX_NAME))
                      }
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="e.g. Customer Feedback"
                      className={`w-full px-4 py-3 text-[13.5px] rounded-xl border bg-white text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 ${
                        nameError
                          ? "border-red-300 ring-2 ring-red-100"
                          : "border-slate-200 focus:border-[#1D6AE5] focus:ring-2 focus:ring-[#1D6AE5]/15"
                      }`}
                    />
                  </div>
                </Field>

                {/* slug — auto-derived, editable */}
                {/* <Field
                  label="Form slug"
                  error={slugError}
                  hint="Auto-generated"
                >
                  <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#1D6AE5] focus-within:ring-2 focus-within:ring-[#1D6AE5]/15 transition-all">
                    <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-[11.5px] text-slate-400 font-mono shrink-0 select-none">
                      /f/
                    </span>
                    <input
                      value={derivedSlug}
                      onChange={(e) => {
                        setSlugOverride(toSlug(e.target.value));
                        setSlugEdited(true);
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, slug: true }))}
                      placeholder="my-form"
                      className="flex-1 px-3 py-3 text-[13px] font-mono bg-white text-slate-700 placeholder-slate-400 outline-none"
                    />
                    {slugEdited && (
                      <button
                        onClick={() => {
                          setSlugEdited(false);
                          setSlugOverride("");
                        }}
                        className="px-3 text-[11px] text-slate-400 hover:text-slate-600 transition-colors font-medium"
                        title="Reset to auto-generated"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {!slugError && derivedSlug && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      api.owlform.io/f/
                      <span className="text-slate-600">{derivedSlug}</span>
                    </p>
                  )}
                </Field> */}

                {/* description */}
                <Field label="Description" hint="Optional">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this form collecting?"
                    rows={3}
                    className="w-full px-4 py-3 text-[13.5px] rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-[#1D6AE5] focus:ring-2 focus:ring-[#1D6AE5]/15 transition-all resize-none leading-relaxed"
                  />
                </Field>

                {/* info strip */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="#1D6AE5"
                    className="shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" opacity=".2" />
                    <path
                      d="M12 16v-4M12 8h.01"
                      stroke="#1D6AE5"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-[12px] text-[#1D6AE5] leading-relaxed">
                    Any fields submitted to this form will be stored
                    automatically and appear in your dashboard in real-time.
                  </p>
                </div>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-[11.5px] text-slate-400 hidden sm:block">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-[10px]">
                    ⌘ Enter
                  </kbd>{" "}
                  to create
                </p>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1D6AE5] hover:bg-[#1558c7] disabled:opacity-60 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-[0_2px_8px_rgba(29,106,229,0.22)]"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Create form
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
