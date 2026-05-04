"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
});

function InView({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function Counter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 72;
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setN(target);
        clearInterval(id);
      } else {
        setN(parseFloat(start.toFixed(decimals)));
      }
    }, 16);
    return () => clearInterval(id);
  }, [inView, target, decimals]);
  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? n.toFixed(decimals) : n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────── */
const WORDS = ["responses.", "leads.", "feedback.", "signups.", "data."];
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    if (!del && text.length < word.length) {
      const t = setTimeout(() => setText(word.slice(0, text.length + 1)), 70);
      return () => clearTimeout(t);
    }
    if (!del && text.length === word.length) {
      const t = setTimeout(() => setDel(true), 2000);
      return () => clearTimeout(t);
    }
    if (del && text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), 38);
      return () => clearTimeout(t);
    }
    if (del && text.length === 0) {
      setDel(false);
      setIdx((i) => (i + 1) % WORDS.length);
    }
  }, [text, del, idx]);
  return (
    <span className="text-[#1D6AE5]">
      {text}
      <span className="inline-block w-[2px] h-[0.8em] bg-[#1D6AE5] ml-[2px] align-middle animate-pulse rounded-full" />
    </span>
  );
}

/* ─────────────────────────────────────────
   CODE BLOCK
───────────────────────────────────────── */
const SNIPPET = `<form
  action="https://api.owlform.com/form/abc123"
  method="POST"
>
  <input name="name" placeholder="Full name" />
  <input name="email" placeholder="Work email" />
  <textarea name="message" rows="4"></textarea>
  <button type="submit">Send message</button>
</form>`;

function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLine = (line: string) =>
    line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/("[^"]*")/g, `<span style="color:#0550AE">$1</span>`)
      .replace(
        /\b(name|action|method|placeholder|type|rows)\b(?=\s*=)/g,
        `<span style="color:#116329">$&</span>`,
      )
      .replace(
        /(&lt;\/?(?:form|input|textarea|button)[^&]*)/g,
        `<span style="color:#953800">$1</span>`,
      )
      .replace(/(&gt;)/g, `<span style="color:#953800">$1</span>`);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] bg-white">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[11px] text-slate-400 font-mono tracking-wide">
          contact-form.html
        </span>
        <button
          onClick={copy}
          className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 font-medium"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-emerald-600"
              >
                ✓ Copied!
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Copy code
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[12.5px] font-mono bg-white leading-[1.75]">
        {SNIPPET.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-slate-300 w-5 shrink-0 text-right mr-5 text-[11px] leading-[1.75]">
              {i + 1}
            </span>
            <span
              className="text-slate-600"
              dangerouslySetInnerHTML={{ __html: renderLine(line) }}
            />
          </div>
        ))}
      </pre>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Submissions appear in your dashboard instantly
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD MOCKUP
───────────────────────────────────────── */
function DashboardMockup() {
  const rows = [
    {
      name: "Sarah Chen",
      email: "sarah@acme.co",
      msg: "Interested in enterprise plan",
      time: "2m ago",
      tag: "New",
    },
    {
      name: "James Park",
      email: "james@startup.io",
      msg: "Love the product, quick question",
      time: "14m ago",
      tag: "New",
    },
    {
      name: "Priya Nair",
      email: "priya@design.co",
      msg: "Can we schedule a demo?",
      time: "1h ago",
      tag: "Read",
    },
    {
      name: "Tom Weber",
      email: "tom@devco.com",
      msg: "Bug report: form not submitting",
      time: "3h ago",
      tag: "Read",
    },
  ];
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.10)] bg-white">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-[#1D6AE5] flex items-center justify-center text-white text-[10px] font-bold">
            O
          </div>
          <span className="text-[12px] font-semibold text-slate-700">
            OwlForm Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-400">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-slate-100 border-b border-slate-100">
        {[
          { label: "Responses today", val: "47" },
          { label: "This week", val: "312" },
          { label: "Conversion rate", val: "68%" },
        ].map((s) => (
          <div key={s.label} className="bg-white px-5 py-4">
            <p className="text-[11px] text-slate-400 mb-1">{s.label}</p>
            <p
              className="text-[22px] font-bold text-slate-800"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {s.val}
            </p>
          </div>
        ))}
      </div>
      <div>
        <div className="grid grid-cols-[1fr_1.4fr_2fr_0.7fr_0.5fr] px-5 py-2.5 text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/50">
          <span>Name</span>
          <span>Email</span>
          <span>Message</span>
          <span>Time</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.email}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="grid grid-cols-[1fr_1.4fr_2fr_0.7fr_0.5fr] px-5 py-3.5 text-[12px] border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
          >
            <span className="font-medium text-slate-700 truncate">
              {r.name}
            </span>
            <span className="text-slate-500 truncate">{r.email}</span>
            <span className="text-slate-400 truncate">{r.msg}</span>
            <span className="text-slate-400">{r.time}</span>
            <span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${r.tag === "New" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
              >
                {r.tag}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const FAQS = [
  {
    q: "Is OwlForm really free?",
    a: "Yes — completely free, no credit card required, no hidden limits. We may offer paid plans in the future for advanced features, but the core product stays free.",
  },
  {
    q: "How do I embed a form on my website?",
    a: "Create a form in your dashboard, copy the unique endpoint URL, and point any HTML form tag's action attribute at it. That's it. No JavaScript required.",
  },
  {
    q: "Where is my data stored?",
    a: "All submissions are stored securely on servers in the EU (Frankfurt). You can export your data as CSV or JSON at any time and delete it permanently from your dashboard.",
  },
  {
    q: "Does it work with Next.js / React?",
    a: "Absolutely. OwlForm works with any framework — Next.js, React, Vue, SvelteKit, plain HTML, WordPress, Webflow. If it can submit an HTML form, it works.",
  },
  {
    q: "Can I get notified on new submissions?",
    a: "Yes. You can configure email notifications, Slack webhooks, and custom HTTP webhooks from the dashboard. Notifications fire within seconds of a submission.",
  },
  {
    q: "What happens if I exceed limits?",
    a: "There are no hard limits on the free plan right now. We'll reach out before implementing any restrictions and give you plenty of notice.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-slate-800 group-hover:text-[#1D6AE5] transition-colors pr-8">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 text-xl shrink-0 leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] text-slate-500 leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main
      className="min-h-screen bg-white text-slate-900 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');`}</style>

      {/* scroll progress */}
      <motion.div
        className="fixed top-0 left-0 h-[2.5px] bg-[#1D6AE5] z-50"
        style={{ width: progressWidth }}
      />

      {/* ── NAV ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-[#1D6AE5] flex items-center justify-center text-white font-bold text-sm"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              O
            </div>
            <span
              className="font-semibold text-slate-900 text-[15px] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              OwlForm
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-slate-500">
            {["Features", "Integrations", "Pricing", "Docs", "Blog"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-slate-900 transition-colors duration-150"
                >
                  {item}
                </a>
              ),
            )}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="text-[13.5px] text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 font-medium">
                Sign in
              </button>
            </Link>
            <Link href="/register">
              <button className="text-[13.5px] bg-[#1D6AE5] hover:bg-[#1558c7] text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-sm">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-5 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #1D6AE5 1px, transparent 1px), linear-gradient(to bottom, #1D6AE5 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-100/60 blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div {...fadeUp(0.05)} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[12.5px] text-[#1D6AE5] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D6AE5] animate-pulse" />
              Trusted by 500+ developers · Free forever
            </div>
          </motion.div>
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              {...fadeUp(0.12)}
              className="text-5xl md:text-[72px] font-bold leading-[1.04] tracking-[-0.03em] text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              The fastest way to <br className="hidden md:block" />
              collect <Typewriter />
            </motion.h1>
            <motion.p
              {...fadeUp(0.22)}
              className="mt-6 text-[18px] text-slate-500 max-w-xl mx-auto leading-relaxed"
            >
              Create a form endpoint in 30 seconds. Drop it into any site. Watch
              responses stream into your dashboard in real-time.
            </motion.p>
            <motion.div
              {...fadeUp(0.32)}
              className="mt-9 flex flex-wrap justify-center gap-3"
            >
              <Link href="/register">
                <button className="group flex items-center gap-2 px-7 py-3.5 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl font-semibold text-[15px] transition-all shadow-[0_4px_20px_rgba(29,106,229,0.30)]">
                  Start for free{" "}
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              </Link>
              {/* <button className="px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-[15px] transition-all">
                View live demo
              </button> */}
            </motion.div>
            <motion.p
              {...fadeUp(0.42)}
              className="mt-5 text-[12.5px] text-slate-400"
            >
              No credit card · No backend · 60-second setup
            </motion.p>
          </div>
          <motion.div {...fadeUp(0.5)} className="mt-16 max-w-2xl mx-auto">
            <CodeBlock />
          </motion.div>
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <InView>
        <section className="py-12 border-y border-slate-100 bg-slate-50/60">
          <div className="max-w-5xl mx-auto px-5">
            <p className="text-center text-[12px] uppercase tracking-widest text-slate-400 mb-8">
              Used by teams at
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {[
                "Vercel",
                "Stripe",
                "Linear",
                "Notion",
                "Figma",
                "Loom",
                "Raycast",
                "Supabase",
              ].map((logo, i) => (
                <motion.span
                  key={logo}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="text-[14px] font-semibold text-slate-300 hover:text-slate-500 transition-colors cursor-default"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {logo}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </InView>

      {/* ── STATS ── */}
      <InView>
        <section className="py-20 px-5 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: 10000, s: "+", label: "Forms created" },
              { n: 2, s: "M+", label: "Total submissions" },
              { n: 99.9, s: "%", label: "Uptime SLA", decimals: 1 },
              { n: 500, s: "+", label: "Active developers" },
            ].map(({ n, s, label, decimals }) => (
              <div key={label}>
                <p
                  className="text-4xl font-bold text-slate-900 mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  <Counter target={n} suffix={s} decimals={decimals ?? 0} />
                </p>
                <p className="text-[13px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </InView>

      {/* ── DASHBOARD PREVIEW ── */}
      <InView>
        <section className="py-16 px-5 md:px-8 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
                Dashboard
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Every response, beautifully organized
              </h2>
              <p className="mt-3 text-[15px] text-slate-500 max-w-md mx-auto">
                See who's reaching out, when, and what they said — all in one
                clean view.
              </p>
            </div>
            <DashboardMockup />
          </div>
        </section>
      </InView>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
              How it works
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              From zero to live in 3 steps
            </h2>
          </InView>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] h-px border-t border-dashed border-slate-200" />
            {[
              {
                step: "01",
                title: "Create your form",
                desc: "Sign up and get a unique form endpoint URL instantly. No config, no database, no DevOps.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Embed anywhere",
                desc: "Paste your endpoint into any HTML form. Works with Next.js, Vue, WordPress, Webflow — anything.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Watch responses flow",
                desc: "Every submission is captured instantly. Get notified via email, Slack, or webhook in real-time.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
            ].map(({ step, title, desc, icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.6, ease }}
                className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1D6AE5] flex items-center justify-center mb-5">
                  {icon}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mb-1.5 tracking-widest">
                  {step}
                </p>
                <h3 className="font-semibold text-[16px] text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-5 md:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
              Features
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Everything you need, nothing you don't
            </h2>
          </InView>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "60-second setup",
                desc: "Register, grab your endpoint, paste into your form. No documentation required.",
                accent: "#1D6AE5",
              },
              {
                title: "Real-time dashboard",
                desc: "Watch submissions appear live. Search, filter, and export your data anytime.",
                accent: "#0EA472",
              },
              {
                title: "Framework agnostic",
                desc: "A plain HTML form action attribute is all it takes. Zero JavaScript required.",
                accent: "#7C3AED",
              },
              {
                title: "Spam protection",
                desc: "Honeypot fields, rate limiting, and bot detection built-in by default.",
                accent: "#EA580C",
              },
              {
                title: "Webhooks & Slack",
                desc: "Get notified instantly. Connect Zapier, Make, Slack, or any webhook endpoint.",
                accent: "#0891B2",
              },
              {
                title: "Export your data",
                desc: "Download as CSV or JSON whenever you want. Your data is yours, always.",
                accent: "#BE185D",
              },
              {
                title: "Custom redirects",
                desc: "Send users to a thank-you page, back to your site, or anywhere after submit.",
                accent: "#059669",
              },
              {
                title: "File uploads",
                desc: "Accept attachments with your forms. Stored securely, downloadable from dashboard.",
                accent: "#D97706",
              },
              {
                title: "99.9% uptime SLA",
                desc: "Built on redundant infrastructure. Your forms are available when you need them.",
                accent: "#4338CA",
              },
            ].map(({ title, desc, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease }}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div
                  className="w-7 h-7 rounded-lg mb-4 flex items-center justify-center"
                  style={{ background: `${accent}18` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: accent }}
                  />
                </div>
                <h3 className="font-semibold text-[14.5px] text-slate-800 mb-1.5">
                  {title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <InView>
        <section className="py-24 px-5 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-4">
                  Integrations
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Connect your entire workflow
                </h2>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8">
                  OwlForm slots into your existing tools. Fire webhooks, push to
                  Slack, trigger Zapier automations, or sync to Notion — the
                  moment a form is submitted.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      name: "Slack",
                      desc: "Get a Slack message on every submission",
                    },
                    { name: "Zapier", desc: "Trigger 6,000+ automations" },
                    {
                      name: "Webhooks",
                      desc: "POST to any endpoint in real-time",
                    },
                    {
                      name: "Email",
                      desc: "Instant email notifications to your team",
                    },
                  ].map(({ name, desc }) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">
                        {name[0]}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-medium text-slate-700">
                          {name}
                        </p>
                        <p className="text-[12px] text-slate-400">{desc}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  "Slack",
                  "Zapier",
                  "Make",
                  "Notion",
                  "Airtable",
                  "HubSpot",
                  "Mailchimp",
                  "Salesforce",
                  "Discord",
                ].map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="aspect-square rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-200 flex items-center justify-center group cursor-default"
                  >
                    <span className="text-[12px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors text-center px-2">
                      {name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </InView>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-5 md:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
              Testimonials
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Loved by builders worldwide
            </h2>
          </InView>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "Replaced our entire form backend in 10 minutes. The dashboard is genuinely beautiful.",
                name: "Alex T.",
                role: "Founder, DevTools Inc.",
              },
              {
                quote:
                  "I've tried every form service out there. OwlForm is the only one that just works without fighting you.",
                name: "Sarah K.",
                role: "Independent developer",
              },
              {
                quote:
                  "Finally, a form service that respects my time. One endpoint URL and I'm done.",
                name: "Mike R.",
                role: "CTO, Startup",
              },
              {
                quote:
                  "The webhook support is flawless. Every submission hits our Slack channel within 2 seconds.",
                name: "Priya N.",
                role: "Lead Engineer",
              },
              {
                quote:
                  "Free, fast, beautiful dashboard. We moved 12 client sites over to OwlForm in one afternoon.",
                name: "Tom W.",
                role: "Agency owner",
              },
              {
                quote:
                  "I can't believe this is free. The uptime has been perfect for 6 months straight.",
                name: "Ji-woo L.",
                role: "Full-stack developer",
              },
            ].map(({ quote, name, role }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.09, duration: 0.55, ease }}
                className="p-7 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-6">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] font-semibold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      {name}
                    </p>
                    <p className="text-[11.5px] text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-5 md:px-8" id="pricing">
        <div className="max-w-4xl mx-auto">
          <InView className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
              Pricing
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Simple pricing, no surprises
            </h2>
            <p className="mt-3 text-[15px] text-slate-500">
              Start free. Stay free. We'll tell you before anything changes.
            </p>
          </InView>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="p-8 rounded-2xl border border-slate-200 bg-white"
            >
              <p className="text-[13px] font-semibold text-slate-500 mb-1">
                Starter
              </p>
              <p
                className="text-5xl font-bold text-slate-900 mb-1"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                $0
              </p>
              <p className="text-[13px] text-slate-400 mb-8">
                Free forever, no credit card
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited forms",
                  "Unlimited submissions",
                  "Real-time dashboard",
                  "Email notifications",
                  "CSV export",
                  "99.9% uptime",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13.5px] text-slate-600"
                  >
                    <span className="text-emerald-500 text-[11px]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="w-full py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl font-semibold text-[14.5px] transition-all duration-200">
                  Get started free
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease }}
              className="p-8 rounded-2xl border-2 border-[#1D6AE5] bg-[#1D6AE5] text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span className="text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
                  Most popular
                </span>
              </div>
              <p className="text-[13px] font-semibold text-blue-200 mb-1">
                Pro
              </p>
              <p
                className="text-5xl font-bold mb-1"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                $12
              </p>
              <p className="text-[13px] text-blue-200 mb-8">
                per month, billed annually
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Starter",
                  "Unlimited submissions",
                  "Webhook integrations",
                  "Slack notifications",
                  "File uploads (100MB)",
                  "Priority support",
                  "Custom redirect URLs",
                  "Team members (5 seats)",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13.5px] text-white/90"
                  >
                    <span className="text-white text-[11px]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white text-[#1D6AE5] hover:bg-blue-50 rounded-xl font-semibold text-[14.5px] transition-all duration-200">
                Start 14-day free trial
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-5 md:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <InView className="text-center mb-14">
            <p className="text-[12px] uppercase tracking-widest text-[#1D6AE5] font-medium mb-3">
              FAQ
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Questions we get all the time
            </h2>
          </InView>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] px-8">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <InView>
        <section className="py-28 px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-4xl md:text-[56px] font-bold leading-[1.07] tracking-[-0.025em] text-slate-900 mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Start collecting responses <br className="hidden md:block" /> in
              minutes.
            </h2>
            <p className="text-[17px] text-slate-500 mb-10 max-w-md mx-auto">
              No backend. No config. No credit card. Just a form endpoint that
              works.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl font-semibold text-[16px] transition-colors shadow-[0_4px_24px_rgba(29,106,229,0.28)]"
                >
                  Create your first form →
                </motion.button>
              </Link>
              <button className="px-8 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-[16px] transition-all">
                View documentation
              </button>
            </div>
            <p className="mt-6 text-[12.5px] text-slate-400">
              Join 500+ developers · Set up in 60 seconds · Free forever
            </p>
          </div>
        </section>
      </InView>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg bg-[#1D6AE5] flex items-center justify-center text-white font-bold text-[11px]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  O
                </div>
                <span
                  className="font-semibold text-slate-800 text-[14px]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  OwlForm
                </span>
              </div>
              <p className="text-[12.5px] text-slate-400 leading-relaxed">
                The fastest way to add forms to any site.
              </p>
            </div>
            {[
              {
                heading: "Product",
                links: ["Features", "Pricing", "Changelog", "Roadmap"],
              },
              {
                heading: "Developers",
                links: ["Documentation", "API Reference", "Examples", "Status"],
              },
              {
                heading: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-[12px] uppercase tracking-widest text-slate-400 mb-4">
                  {heading}
                </p>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12.5px] text-slate-400">
            <p>
              © {new Date().getFullYear()} OwlForm, Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="hover:text-slate-600 transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
