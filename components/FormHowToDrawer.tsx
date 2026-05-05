"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/* ─────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.owlform.io";

/* ─────────────────────────────────────────
   CODE SNIPPET BLOCK
───────────────────────────────────────── */
function CodeBlock({
  code,
  language = "html",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* super minimal syntax highlight */
  const highlight = (line: string) =>
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
      .replace(/(&gt;)/g, `<span style="color:#953800">$1</span>`)
      .replace(/(POST|GET)/g, `<span style="color:#8250DF">$1</span>`);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      {/* toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-700 transition-colors font-medium"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-emerald-600 flex items-center gap-1"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      {/* code */}
      <pre className="p-4 overflow-x-auto text-[12px] font-mono bg-white leading-[1.8]">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-slate-300 w-5 shrink-0 text-right mr-4 text-[10.5px] leading-[1.8]">
              {i + 1}
            </span>
            <span
              className="text-slate-600"
              dangerouslySetInnerHTML={{ __html: highlight(line) }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────── */
function Step({
  number,
  title,
  accent,
}: {
  number: number;
  title: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold text-white shrink-0"
        style={{ background: accent }}
      >
        {number}
      </div>
      <h3
        className="text-[15px] font-bold text-slate-800"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {title}
      </h3>
    </div>
  );
}

/* ─────────────────────────────────────────
   INLINE CODE PILL
───────────────────────────────────────── */
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[11.5px] font-mono text-slate-700 border border-slate-200">
      {children}
    </code>
  );
}

/* ─────────────────────────────────────────
   REDIRECT ROW
───────────────────────────────────────── */
function RedirectRow({
  condition,
  result,
  icon,
}: {
  condition: string;
  result: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-base shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[12.5px] font-semibold text-slate-700">
          {condition}
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5">{result}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DRAWER
───────────────────────────────────────── */
const FormHowToDrawer = ({ formSlug }: { formSlug: string }) => {
  const [open, setOpen] = useState(false);

  const embedSnippet = `<form
  action="${BASE_URL}/form/${formSlug}"
  method="POST"
>
  <input name="name" placeholder="Your name" />
  <input name="email" placeholder="Email address" />
  <textarea name="message" rows="4"></textarea>

  <button type="submit">Send</button>
</form>`;

  const endpointSnippet = `POST ${BASE_URL}/form/${formSlug}`;

  const redirectSnippet = `POST ${BASE_URL}/form/${formSlug}?redirectUrl=https://example.com/thanks`;

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        How to use
      </button>

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
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            />

            {/* drawer */}
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-slate-100 max-h-[88vh] flex flex-col"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');`}</style>

              {/* drag handle */}
              <div className="flex justify-center pt-4 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-200" />
              </div>

              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
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
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className="text-[16px] font-bold text-slate-900 leading-tight"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      Embed & use this form
                    </h2>
                    <p className="text-[12px] text-slate-400 font-mono mt-0.5">
                      {formSlug}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
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

              {/* scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8">
                {/* ── SECTION 1: Embed ── */}
                <section>
                  <Step
                    number={1}
                    title="Embed this form in your website"
                    accent="#1D6AE5"
                  />
                  <p className="text-[13.5px] text-slate-500 leading-relaxed mb-4">
                    Point any HTML <InlineCode>{"<form>"}</InlineCode> tag's{" "}
                    <InlineCode>action</InlineCode> attribute at your unique
                    endpoint. No JavaScript, no SDK — just plain HTML.
                  </p>
                  <CodeBlock code={embedSnippet} language="html" />
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-[#1D6AE5] mt-0.5 shrink-0">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" opacity=".2" />
                        <path
                          d="M12 16v-4M12 8h.01"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <p className="text-[12px] text-[#1D6AE5] leading-relaxed">
                      Any field name you use becomes a column in your dashboard.
                      Add as many <InlineCode>name=""</InlineCode> fields as you
                      need — they're stored automatically.
                    </p>
                  </div>
                </section>

                {/* ── SECTION 2: How it works ── */}
                <section>
                  <Step
                    number={2}
                    title="How submission works"
                    accent="#0EA472"
                  />
                  <p className="text-[13.5px] text-slate-500 leading-relaxed mb-4">
                    Every form submission sends a <InlineCode>POST</InlineCode>{" "}
                    request to your endpoint. The request body is parsed and
                    stored as structured JSON in your dashboard — visible in
                    real-time.
                  </p>
                  <CodeBlock code={endpointSnippet} language="endpoint" />

                  <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        icon: "⚡",
                        title: "Instant capture",
                        desc: "Submissions appear in your dashboard within milliseconds",
                      },
                      {
                        icon: "🗄️",
                        title: "Auto-structured",
                        desc: "Every field is parsed and indexed automatically",
                      },
                      {
                        icon: "🔒",
                        title: "Spam protected",
                        desc: "Built-in honeypot and rate limiting on every endpoint",
                      },
                      {
                        icon: "📤",
                        title: "Exportable",
                        desc: "Download all submissions as CSV or JSON anytime",
                      },
                    ].map(({ icon, title, desc }) => (
                      <div
                        key={title}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="text-base shrink-0">{icon}</span>
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-700">
                            {title}
                          </p>
                          <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── SECTION 3: Redirects ── */}
                <section>
                  <Step
                    number={3}
                    title="Redirect behavior after submit"
                    accent="#7C3AED"
                  />
                  <p className="text-[13.5px] text-slate-500 leading-relaxed mb-4">
                    Control where users land after they hit submit. Use the{" "}
                    <InlineCode>redirectUrl</InlineCode> query param or rely on
                    the automatic fallback chain.
                  </p>

                  <div className="space-y-2 mb-4">
                    <RedirectRow
                      icon="🎯"
                      condition="redirectUrl param provided"
                      result="User is redirected to that URL immediately after submit"
                    />
                    <RedirectRow
                      icon="↩️"
                      condition="No redirectUrl, Referer header present"
                      result="User is sent back to the originating page"
                    />
                    <RedirectRow
                      icon="✅"
                      condition="Both missing"
                      result="User lands on the default OwlForm success page"
                    />
                  </div>

                  <CodeBlock code={redirectSnippet} language="endpoint" />
                </section>

                {/* ── SECTION 4: Pro tip ── */}
                <section>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💡</span>
                      <h3
                        className="text-[14px] font-bold text-amber-900"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Pro tip
                      </h3>
                    </div>
                    <p className="text-[13px] text-amber-800 leading-relaxed">
                      Pair <InlineCode>redirectUrl</InlineCode> with a custom
                      thank-you page, an upsell funnel, or a booking flow. Your
                      users get a seamless experience — you get the data.
                    </p>
                  </div>
                </section>

                {/* bottom spacing for footer */}
                <div className="h-2" />
              </div>

              {/* footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                <p className="text-[12px] text-slate-400">
                  Need help?{" "}
                  <a
                    href="https://docs.owlform.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1D6AE5] font-semibold hover:underline"
                  >
                    Read the docs →
                  </a>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[13px] font-semibold transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 bg-[#1D6AE5] hover:bg-[#1558c7] text-white rounded-xl text-[13px] font-semibold transition-colors shadow-[0_2px_8px_rgba(29,106,229,0.25)]"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormHowToDrawer;
