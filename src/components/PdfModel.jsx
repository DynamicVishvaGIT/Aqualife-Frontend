import { useEffect, useState, useRef } from "react";
import Modal from "../components/Modal";
import {
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";

/**
 * PdfModel
 * -----------------------------------------------------------------------
 * Animated, staged confirmation modal for PDF downloads.
 *
 * States:
 *   form        → collects Name / Email / Phone before anything downloads
 *   downloading → triggers the real file download immediately, shows a
 *                 spinner + filling progress bar for a moment so the
 *                 action feels acknowledged
 *   success     → checkmark pop-in, "Done" button; auto-closes shortly
 *                 after, but user can also close early
 *
 * `doc` shape:
 *   {
 *     title: string,
 *     description: string,
 *     url: string,
 *     fileName: string,
 *   }
 *
 * Required global keyframes in your index.css / globals.css:
 *
 * @keyframes fadeScaleIn {
 *   from { opacity: 0; transform: scale(0.96); }
 *   to   { opacity: 1; transform: scale(1);    }
 * }
 * @keyframes floatY {
 *   0%, 100% { transform: translateY(0);    }
 *   50%      { transform: translateY(-4px); }
 * }
 * @keyframes checkPop {
 *   0%   { transform: scale(0);    opacity: 0; }
 *   60%  { transform: scale(1.15);             }
 *   100% { transform: scale(1);    opacity: 1; }
 * }
 * @keyframes ringPulse {
 *   0%   { transform: scale(0.8); opacity: 1; }
 *   100% { transform: scale(1.4); opacity: 0; }
 * }
 * @keyframes progressFill {
 *   from { width: 0%;    }
 *   to   { width: 100%;  }
 * }
 * -----------------------------------------------------------------------
 */

const AUTO_CLOSE_DELAY    = 1600; // ms after "success" before auto-close
const DOWNLOADING_DURATION = 900; // ms for spinner + progress bar

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

const emptyForm = { name: "", email: "", phone: "" };

/* ─── helpers ─────────────────────────────────────────────────── */

/**
 * Trigger a file download.
 * Falls back to window.open for cross-origin URLs where the
 * `download` attribute is silently ignored by the browser.
 */
function triggerDownload(url, fileName) {
  try {
    const isSameOrigin =
      new URL(url, window.location.href).origin === window.location.origin;

    const link = document.createElement("a");
    link.href = url;
    link.rel  = "noopener noreferrer";

    if (isSameOrigin) {
      link.download = fileName || "document.pdf";
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    // Malformed URL or env without DOM — open in new tab as last resort
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/* ─── component ───────────────────────────────────────────────── */

function PdfModel({ open, setOpen, doc }) {
  const [status, setStatus]           = useState("form"); // 'form' | 'downloading' | 'success'
  const [form, setForm]               = useState(emptyForm);
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // prevent double-submit

  const timers = useRef([]);

  /* Reset when modal opens — split on `open` only so a doc swap
     mid-open (rare) doesn't flash the form mid-download.         */
  useEffect(() => {
    if (open) {
      setStatus("form");
      setForm(emptyForm);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Cleanup timers on unmount */
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /* Generic field updater (name, email) */
  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as the user corrects it
    setErrors((prev) =>
      prev[field] !== undefined ? { ...prev, [field]: undefined } : prev
    );
  };

  /* Phone — only digits, hard cap at 10 */
  const handlePhoneChange = (e) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: numeric }));
    setErrors((prev) =>
      prev.phone !== undefined ? { ...prev, phone: undefined } : prev
    );
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim())
      next.name = "Name is required";

    if (!form.email.trim())
      next.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Enter a valid email";

    if (!form.phone.trim())
      next.phone = "Phone number is required";
    else if (!PHONE_RE.test(form.phone.trim()))
      next.phone = "Enter a valid 10-digit number";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const startDownload = () => {
    if (!doc?.url) {
      setOpen(false);
      return;
    }

    // Trigger the actual download immediately — animation below is
    // purely visual feedback, it does NOT delay the real download.
    triggerDownload(doc.url, doc.fileName);

    setStatus("downloading");

    const t1 = setTimeout(() => setStatus("success"), DOWNLOADING_DURATION);
    const t2 = setTimeout(
      () => setOpen(false),
      DOWNLOADING_DURATION + AUTO_CLOSE_DELAY
    );
    timers.current.push(t1, t2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guard against double-submit (rapid clicks / Enter spam)
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);

    // Optional: POST lead data to your backend/CRM before downloading
    // await fetch("/api/leads", { method: "POST", body: JSON.stringify(form) });

    startDownload();
  };

  const handleClose = () => {
    // Don't allow close during download animation
    if (status === "downloading") return;
    clearTimers();
    setOpen(false);
  };

  /* ── render ─────────────────────────────────────────────────── */

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={status === "success" ? undefined : doc?.title || "Download PDF"}
      size="md"
      showCloseButton={status !== "downloading"}
      closeOnOverlayClick={status !== "downloading"}
      footer={
        status === "form" ? (
          <>
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-semibold px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="pdf-lead-form"
              disabled={isSubmitting}
              className="group inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <Download
                size={16}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              Download
            </button>
          </>
        ) : status === "success" ? (
          <button
            onClick={handleClose}
            className="w-full sm:w-auto text-sm font-semibold px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all"
          >
            Done
          </button>
        ) : null
      }
    >
      {/* ── FORM state ─────────────────────────────────────────── */}
      {status === "form" && (
        <div className="animate-[fadeScaleIn_0.2s_ease-out]">
          <div className="flex justify-center mb-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 animate-[floatY_2.6s_ease-in-out_infinite]">
              <FileText size={28} strokeWidth={1.8} />
            </div>
          </div>

          <form
            id="pdf-lead-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-3.5"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Name
              </label>
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                  errors.name
                    ? "border-red-400 bg-red-50/40"
                    : "border-gray-200 focus-within:border-blue-500 bg-white"
                }`}
              >
                <User size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="Your full name"
                  className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email
              </label>
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                  errors.email
                    ? "border-red-400 bg-red-50/40"
                    : "border-gray-200 focus-within:border-blue-500 bg-white"
                }`}
              >
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="you@example.com"
                  className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone — digits only, max 10 */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone Number
              </label>
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                  errors.phone
                    ? "border-red-400 bg-red-50/40"
                    : "border-gray-200 focus-within:border-blue-500 bg-white"
                }`}
              >
                <Phone size={16} className="text-gray-400 shrink-0" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ── DOWNLOADING state ──────────────────────────────────── */}
      {status === "downloading" && (
        <div className="animate-[fadeScaleIn_0.2s_ease-out] flex flex-col items-center py-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Loader2 size={26} className="animate-spin" />
          </div>
          <p className="text-center text-gray-700 font-medium">
            Preparing your download…
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            {doc?.fileName}
          </p>

          <div className="mt-4 h-1.5 w-full max-w-[220px] rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                animation: `progressFill ${DOWNLOADING_DURATION}ms ease-out forwards`,
              }}
            />
          </div>
        </div>
      )}

      {/* ── SUCCESS state ──────────────────────────────────────── */}
      {status === "success" && (
        <div className="flex flex-col items-center py-2 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 animate-[checkPop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <CheckCircle2 size={30} strokeWidth={1.8} />
            <span className="absolute inset-0 rounded-full border-2 border-green-200 animate-[ringPulse_0.6s_ease-out]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Download started</h3>
          <p className="mt-1 text-sm text-gray-500">
            {doc?.fileName || "Your file"} should appear in your downloads
            shortly.
          </p>
        </div>
      )}
    </Modal>
  );
}

export default PdfModel;