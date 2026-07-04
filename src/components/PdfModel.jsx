import { useEffect, useState, useRef } from "react";
import Modal from "../components/Modal";
import { FileText, Download, CheckCircle2, Loader2 } from "lucide-react";

/**
 * PdfModel
 * -----------------------------------------------------------------------
 * Animated, staged confirmation modal for PDF downloads.
 *
 * States:
 *   idle        → shows the doc icon, title, description, Cancel/Download
 *   downloading → triggers the real file download immediately, shows a
 *                 spinner + filling progress bar for a moment so the
 *                 action feels acknowledged (not just an instant jump)
 *   success      → checkmark pop-in, "Done" button; auto-closes shortly
 *                 after, but the user can also close it early
 *
 * Nothing downloads just from opening the modal, and Cancel / Esc /
 * backdrop / X all close with no download — same contract as before.
 *
 * `doc` shape:
 *   {
 *     title: string,
 *     description: string,
 *     url: string,
 *     fileName: string,
 *   }
 * -----------------------------------------------------------------------
 */

const AUTO_CLOSE_DELAY = 1600; // ms, after reaching "success"
const DOWNLOADING_DURATION = 900; // ms, spinner + progress bar duration

function PdfModel({ open, setOpen, doc }) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'downloading' | 'success'
  const timers = useRef([]);

  // Reset to idle every time the modal is (re)opened for a new doc
  useEffect(() => {
    if (open) setStatus("idle");
    return () => timers.current.forEach(clearTimeout);
  }, [open, doc]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const handleConfirm = () => {
    if (!doc?.url) {
      setOpen(false);
      return;
    }

    // Trigger the actual file download right away — the animation below
    // is purely a feedback layer, it doesn't delay the real download.
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.fileName || "document.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatus("downloading");

    const t1 = setTimeout(() => setStatus("success"), DOWNLOADING_DURATION);
    const t2 = setTimeout(() => setOpen(false), DOWNLOADING_DURATION + AUTO_CLOSE_DELAY);
    timers.current.push(t1, t2);
  };

  const handleClose = () => {
    clearTimers();
    setOpen(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={status === "success" ? undefined : doc?.title || "Download PDF"}
      size="md"
      showCloseButton={status !== "downloading"}
      closeOnOverlayClick={status !== "downloading"}
      footer={
        status === "idle" ? (
          <>
            <button
              onClick={handleClose}
              className="text-sm font-semibold px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="group inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-sm hover:shadow-md"
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
      {status === "idle" && (
        <div className="animate-[fadeScaleIn_0.2s_ease-out]">
          <div className="flex justify-center mb-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 animate-[floatY_2.6s_ease-in-out_infinite]">
              <FileText size={28} strokeWidth={1.8} />
            </div>
          </div>
          <p className="text-center">{doc?.description || "Your download will start once you confirm below."}</p>
        </div>
      )}

      {status === "downloading" && (
        <div className="animate-[fadeScaleIn_0.2s_ease-out] flex flex-col items-center py-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Loader2 size={26} className="animate-spin" />
          </div>
          <p className="text-center text-gray-700 font-medium">Preparing your download…</p>
          <p className="text-center text-xs text-gray-400 mt-1">{doc?.fileName}</p>

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

      {status === "success" && (
        <div className="flex flex-col items-center py-2 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 animate-[checkPop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <CheckCircle2 size={30} strokeWidth={1.8} />
            <span className="absolute inset-0 rounded-full border-2 border-green-200 animate-[ringPulse_0.6s_ease-out]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Download started</h3>
          <p className="mt-1 text-sm text-gray-500">
            {doc?.fileName || "Your file"} should appear in your downloads shortly.
          </p>
        </div>
      )}
    </Modal>
  );
}

export default PdfModel;

/**
 * Add these keyframes once to your global CSS (e.g. index.css /
 * globals.css) — Tailwind's arbitrary `animate-[...]` values reference
 * them by name, same pattern as Modal.jsx's own keyframes.
 *

 * }
 */