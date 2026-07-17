// components/AddressFormModal.jsx
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Home, Building2, ShieldCheck, Check, Loader2, X } from "lucide-react";
import gsap from "gsap";
import PINCODE_LOOKUP from "../static_data";

/**
 * AddressFormModal
 *
 * Same field set as the full-page AddressForm (Contact Details, Address,
 * Address Type, make-default) but as an overlay modal — used by
 * SelectDeliveryAddress for both "Add New Address" and "Edit".
 *
 * Props:
 *  - isOpen: bool
 *  - initialData: address object to prefill for edit, or null for add
 *  - onClose: fn — called when the modal should close without saving
 *  - onSave: fn(formData) — called with the validated form on submit;
 *            the parent decides whether this is a create or an update
 */

const emptyForm = {
  name: "",
  mobile: "",
  pincode: "",
  house: "",
  address: "",
  locality: "",
  city: "",
  state: "",
  addressType: "Home",
  makeDefault: false,
};

const REQUIRED_FIELDS = ["name", "mobile", "pincode", "house", "address", "locality", "city", "state"];

const ADDRESS_TYPES = [
  { key: "Home", icon: Home },
  { key: "Office", icon: Building2 },
];

export default function AddressFormModal({ isOpen, initialData, onClose, onSave }) {
  const [mounted, setMounted] = useState(isOpen);
  const [form, setForm] = useState(() => (initialData ? { ...emptyForm, ...initialData } : emptyForm));
  const [errors, setErrors] = useState({});
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [closing, setClosing] = useState(false);

  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const isEdit = Boolean(initialData);

  // Mount/unmount + reset form whenever the modal opens for a new target
  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
      setErrors({});
      setSaveState("idle");
      setPincodeStatus(null);
      setClosing(false);
      setMounted(true);
    }
  }, [isOpen, initialData]);

  // Body scroll lock while open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  // Entrance animation
  useLayoutEffect(() => {
    if (!mounted || closing) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([overlayRef.current, panelRef.current], { opacity: 1 });
      gsap.set(panelRef.current, { y: 0, scale: 1 });
      return;
    }
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, y: 24, scale: 0.97 });

    gsap
      .timeline()
      .to(overlayRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .to(panelRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.15");
  }, [mounted, closing]);

  const requestClose = () => {
    if (saveState === "saving") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !overlayRef.current || !panelRef.current) {
      setMounted(false);
      onClose();
      return;
    }
    setClosing(true);
    gsap
      .timeline({
        onComplete: () => {
          setMounted(false);
          setClosing(false);
          onClose();
        },
      })
      .to(panelRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.15");
  };

  // Esc to close
  useEffect(() => {
    if (!mounted) return;
    const handler = (e) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!String(form[key]).trim()) next[key] = "Required";
    });
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) next.mobile = "Enter a valid 10-digit number";
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) next.pincode = "Enter a valid 6-digit pin code";
    return next;
  };

  const shakeAndFocusInvalid = (fieldErrors) => {
    const order = REQUIRED_FIELDS.filter((key) => fieldErrors[key]);
    if (order.length === 0) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    order.forEach((key) => {
      const el = document.querySelector(`[data-field="${key}"]`);
      if (!el) return;
      if (!prefersReducedMotion) {
        gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1.2, 0.35)" });
      }
    });
    const firstEl = document.querySelector(`[data-field="${order[0]}"]`);
    if (firstEl) {
      firstEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      firstEl.querySelector("input")?.focus();
    }
  };

  const handlePincodeChange = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setField("pincode", digits);
    if (digits.length !== 6) {
      setPincodeStatus(null);
      return;
    }
    const match = PINCODE_LOOKUP[digits];
    if (match) {
      setForm((f) => ({ ...f, city: match.city, state: match.state }));
      setPincodeStatus("found");
    } else {
      setPincodeStatus("unknown");
    }
  };

  const handleAddressTypeKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = ADDRESS_TYPES.findIndex((t) => t.key === form.addressType);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = ADDRESS_TYPES[(idx + dir + ADDRESS_TYPES.length) % ADDRESS_TYPES.length];
    setField("addressType", next.key);
  };

  const bumpButton = (el) => {
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saveState !== "idle") return;

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      shakeAndFocusInvalid(fieldErrors);
      return;
    }

    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      onSave(form); // parent updates the address list immediately
      setTimeout(() => requestClose(), 500);
    }, 600);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-4">
      {/* Notched-outline label animation keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={requestClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit address" : "Add new address"}
        className="relative w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto
          bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl mt-auto sm:mt-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-5 bg-white border-b border-slate-100">
          <h2 className="heading text-lg font-bold text-slate-900">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 sm:px-8 py-6">
          {/* Contact details */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={14} className="text-[#0061C2]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Field
              data-field="name"
              label="Full Name*"
              value={form.name}
              onChange={(v) => setField("name", v)}
              error={errors.name}
            />
            <Field
              data-field="mobile"
              label="Mobile Number*"
              value={form.mobile}
              onChange={(v) => setField("mobile", v.replace(/\D/g, "").slice(0, 10))}
              error={errors.mobile}
              inputMode="numeric"
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
              <MapPin size={14} className="text-[#0061C2]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Delivery Address</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
            <div data-field="pincode" className="mb-3">
              <Field
                label="Pin Code*"
                value={form.pincode}
                onChange={handlePincodeChange}
                error={errors.pincode}
                inputMode="numeric"
              />
              {pincodeStatus === "found" && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Check size={12} /> City &amp; state auto-filled
                </p>
              )}
              {pincodeStatus === "unknown" && (
                <p className="mt-1 text-[11px] text-slate-400">Pin code not recognized — enter manually</p>
              )}
            </div>
            <Field
              data-field="house"
              label="House Number / Tower / Block*"
              value={form.house}
              onChange={(v) => setField("house", v)}
              error={errors.house}
            />
          </div>

          <div className="mb-4">
            <Field
              data-field="address"
              label="Address (Locality, Building, Street)*"
              value={form.address}
              onChange={(v) => setField("address", v)}
              error={errors.address}
            />
          </div>

          <div className="mb-4">
            <Field
              data-field="locality"
              label="Locality / Town*"
              value={form.locality}
              onChange={(v) => setField("locality", v)}
              error={errors.locality}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Field
              data-field="city"
              label="City / District*"
              value={form.city}
              onChange={(v) => setField("city", v)}
              error={errors.city}
            />
            <Field
              data-field="state"
              label="State*"
              value={form.state}
              onChange={(v) => setField("state", v)}
              error={errors.state}
            />
          </div>

          {/* Address type */}
          <p className="text-sm font-bold text-slate-900 mb-3">Address Type</p>
          <div
            role="radiogroup"
            aria-label="Address type"
            onKeyDown={handleAddressTypeKeyDown}
            className="flex items-center gap-3 mb-6"
          >
            {ADDRESS_TYPES.map(({ key, icon: Icon }) => {
              const active = form.addressType === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setField("addressType", key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0061C2]
                    ${
                      active
                        ? "border-[#0061C2] bg-blue-50 text-[#0061C2]"
                        : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                >
                  <Icon size={15} />
                  {key}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2.5 mb-8 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={form.makeDefault}
              onChange={(e) => setField("makeDefault", e.target.checked)}
              className="w-4 h-4 rounded accent-[#0061C2] cursor-pointer"
            />
            <span className="text-sm text-slate-600">Make this my default address</span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saveState !== "idle"}
              onClick={(e) => {
                bumpButton(e.currentTarget);
                requestClose();
              }}
              className="flex-1 py-3 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveState !== "idle"}
              onClick={(e) => saveState === "idle" && bumpButton(e.currentTarget)}
              className="flex-1 py-3 text-sm active:scale-95 transition-transform disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer bg-[#0061C2] text-white rounded-full font-semibold"
            >
              {saveState === "saving" && (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              )}
              {saveState === "saved" && (
                <>
                  <Check size={16} />
                  Saved
                </>
              )}
              {saveState === "idle" && (isEdit ? "Update Address" : "Save Address")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

/* ── Field — notched outline input ── */
function Field({ label, value, onChange, error, inputMode, "data-field": dataField }) {
  return (
    <div data-field={dataField}>
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-colors duration-200
            ${error ? "border-red-300" : "border-slate-200 focus-within:border-[#0061C2]"}`}
        >
          <input
            type="text"
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            className="peer w-full bg-transparent rounded-xl px-4 pt-4 pb-3 text-sm text-slate-900 outline-none"
          />
          <label
            className={`absolute left-3 px-1 bg-white text-slate-400
              transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none
              origin-left
              top-1/2 -translate-y-1/2 text-sm scale-100
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-[0.82] peer-focus:text-[#0061C2]
              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-[0.82]
              ${error ? "peer-focus:text-red-400" : ""}`}
          >
            {label}
          </label>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500" style={{ animation: "fadeSlideIn 0.2s ease-out" }}>
          {error}
        </p>
      )}
    </div>
  );
}