import { useEffect, useRef, useState } from "react";

const BRAND = "#0061C2";

const initialState = { name: "", number: "", email: "", message: "" };

export default function EnquireModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  // focus first input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.number.trim()) e.number = "Phone number is required";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.number)) e.number = "Enter a valid number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    // TODO: wire to API
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .enq-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,.52);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: enqFadeIn .2s ease;
        }
        @keyframes enqFadeIn { from { opacity:0 } to { opacity:1 } }

        .enq-card {
          background: #fff;
          border-radius: 16px;
          width: 100%; max-width: 480px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,97,194,.18), 0 4px 16px rgba(0,0,0,.12);
          animation: enqSlideUp .25s cubic-bezier(.22,.9,.35,1);
        }
        @keyframes enqSlideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }

        .enq-header {
          background: linear-gradient(135deg, #0061C2 0%, #004A9F 100%);
          padding: 28px 28px 24px;
          position: relative;
        }
        .enq-header-label {
          font-size: 11px; font-weight: 700; letter-spacing: .12em;
          color: rgba(255,255,255,.65); text-transform: uppercase; margin-bottom: 4px;
        }
        .enq-header-title {
          font-size: 22px; font-weight: 700; color: #fff; line-height: 1.2;
        }
        .enq-header-sub {
          font-size: 13px; color: rgba(255,255,255,.72); margin-top: 4px;
        }
        .enq-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,.15);
          border: none; cursor: pointer; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; line-height: 1;
          transition: background .15s;
        }
        .enq-close:hover { background: rgba(255,255,255,.28); }

        .enq-body { padding: 24px 28px 28px; }

        .enq-field { margin-bottom: 16px; }
        .enq-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #374151; margin-bottom: 6px; letter-spacing: .02em;
        }
        .enq-input, .enq-textarea {
          width: 100%; box-sizing: border-box;
          border: 1.5px solid #D1D5DB;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px; color: #111827;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          font-family: inherit;
          background: #FAFAFA;
        }
        .enq-input:focus, .enq-textarea:focus {
          border-color: #0061C2;
          box-shadow: 0 0 0 3px rgba(0,97,194,.12);
          background: #fff;
        }
        .enq-input.err, .enq-textarea.err {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,.1);
        }
        .enq-textarea { resize: vertical; min-height: 90px; }
        .enq-err-msg {
          font-size: 11.5px; color: #EF4444; margin-top: 4px; display: block;
        }

        .enq-row { display: flex; gap: 12px; }
        .enq-row .enq-field { flex: 1; }

        .enq-submit {
          width: 100%; padding: 13px;
          background: #0061C2;
          color: #fff; font-size: 15px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          margin-top: 4px;
          transition: background .15s, transform .1s;
          letter-spacing: .02em;
        }
        .enq-submit:hover { background: #004FA3; }
        .enq-submit:active { transform: scale(.98); }

        /* Success state */
        .enq-success {
          padding: 48px 28px; text-align: center;
        }
        .enq-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(0,97,194,.1);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .enq-success-title { font-size: 20px; font-weight: 700; color: #111827; }
        .enq-success-sub { font-size: 14px; color: #6B7280; margin-top: 6px; }
        .enq-success-btn {
          margin-top: 24px; padding: 10px 28px;
          border: 1.5px solid #0061C2; color: #0061C2;
          background: transparent; border-radius: 8px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .enq-success-btn:hover { background: #0061C2; color: #fff; }
      `}</style>

      <div
        className="enq-overlay"
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div className="enq-card" role="dialog" aria-modal="true" aria-label="Enquiry Form">

          {/* Header */}
          <div className="enq-header">
            <p className="enq-header-label">Get in Touch</p>
            <h2 className="enq-header-title">Enquire Now</h2>
            <p className="enq-header-sub">We'll get back to you within 24 hours.</p>
            <button className="enq-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {submitted ? (
            <div className="enq-success">
              <div className="enq-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0061C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="enq-success-title">Enquiry Sent!</p>
              <p className="enq-success-sub">Our team will reach out to you shortly.</p>
              <button className="enq-success-btn" onClick={handleReset}>Send Another</button>
            </div>
          ) : (
            <div className="enq-body">
              {/* Name + Number row */}
              <div className="enq-row">
                <div className="enq-field">
                  <label className="enq-label" htmlFor="enq-name">Full Name</label>
                  <input
                    id="enq-name"
                    ref={firstInputRef}
                    className={`enq-input${errors.name ? " err" : ""}`}
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange("name")}
                  />
                  {errors.name && <span className="enq-err-msg">{errors.name}</span>}
                </div>
                <div className="enq-field">
                  <label className="enq-label" htmlFor="enq-number">Phone</label>
                  <input
                    id="enq-number"
                    className={`enq-input${errors.number ? " err" : ""}`}
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.number}
                    onChange={handleChange("number")}
                  />
                  {errors.number && <span className="enq-err-msg">{errors.number}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-email">Email Address</label>
                <input
                  id="enq-email"
                  className={`enq-input${errors.email ? " err" : ""}`}
                  type="email"
                  placeholder="rahul@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                />
                {errors.email && <span className="enq-err-msg">{errors.email}</span>}
              </div>

              {/* Message */}
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-message">Message</label>
                <textarea
                  id="enq-message"
                  className={`enq-textarea${errors.message ? " err" : ""}`}
                  placeholder="Tell us about your requirements..."
                  value={form.message}
                  onChange={handleChange("message")}
                />
                {errors.message && <span className="enq-err-msg">{errors.message}</span>}
              </div>

              <button className="enq-submit" onClick={handleSubmit}>
                Submit Enquiry
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}