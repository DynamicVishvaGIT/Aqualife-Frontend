// pages/CheckoutAddress.jsx
import { useState, useRef, useLayoutEffect } from "react";
import { MapPin, Home, Building2, ShieldCheck, Truck, ChevronLeft, Check, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { WaterButton } from "../components/WaterButton";
import PINCODE_LOOKUP from "../static_data";

/**
 * CheckoutAddress
 *
 * Contact Details → Address → Address Type → Save/Cancel, with a sticky
 * price summary on the right. Styled to Aqualife's blue (#0061C2) theme.
 *
 * - Save shows saving → saved states (spinner, checkmark, confirmation
 *   banner) before navigating on.
 * - Pin code auto-lookup fills City/State for recognized codes.
 * - Address Type is a keyboard-operable radio group (arrow keys to switch).
 * - Invalid submit scrolls to + focuses the first errored field.
 * - Inputs use a Material-style "notched outline": the label sits directly
 *   on the border line and visually breaks it when floated.
 */

const ORDER_ITEMS_COUNT = 4;

const initialForm = {
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

export default function AddressForm({ onSaved }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | "found" | "unknown"

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
      const input = firstEl.querySelector("input");
      input?.focus();
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

  const handleSave = (e) => {
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
      setTimeout(() => {
        if (onSaved) onSaved(form);
        else navigate("/select-address");
      }, 500);
    }, 700);
  };

  const bumpButton = (el) => {
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
  };

  const handleAddressTypeKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = ADDRESS_TYPES.findIndex((t) => t.key === form.addressType);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = ADDRESS_TYPES[(idx + dir + ADDRESS_TYPES.length) % ADDRESS_TYPES.length];
    setField("addressType", next.key);
  };

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.6 } })
        .fromTo(".ca-form-card", { opacity: 0, y: 24 }, { opacity: 1, y: 0 })
        .fromTo(".ca-field", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.04 }, "-=0.4")
        .fromTo(".ca-summary", { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, "-=0.5");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const priceRows = [
    { label: "Total MRP", value: "₹7,493" },
    { label: "Discount on MRP", value: "− ₹2,334", accent: "text-emerald-600" },
    { label: "Delivery & Installation", value: "FREE", accent: "text-emerald-600" },
  ];

  return (
    <div ref={rootRef} className="relative min-h-screen pt-25 lg:pt-33 bg-[#F7FAFF]">
      {/* Notched-outline label animation keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="primary-container pb-16">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0061C2] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back to cart
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* ── LEFT: Address form ── */}
          <form
            onSubmit={handleSave}
            noValidate
            className="ca-form-card w-full lg:w-[62%] bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
          >
            {/* Contact details */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                <ShieldCheck size={14} className="text-[#0061C2]" />
              </div>
              <h2 className="heading text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field
                className="ca-field"
                data-field="name"
                label="Full Name*"
                value={form.name}
                onChange={(v) => setField("name", v)}
                error={errors.name}
              />
              <Field
                className="ca-field"
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
              <h2 className="heading text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
              <div className="ca-field mb-3" data-field="pincode">
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
                  <p className="mt-1 text-[11px] text-slate-400">Pin code not recognized — enter city/state manually</p>
                )}
              </div>
              <Field
                className="ca-field"
                data-field="house"
                label="House Number / Tower / Block*"
                value={form.house}
                onChange={(v) => setField("house", v)}
                error={errors.house}
              />
            </div>
        

            <div className="ca-field mb-4">
              <Field
                data-field="address"
                label="Address (Locality, Building, Street)*"
                value={form.address}
                onChange={(v) => setField("address", v)}
                error={errors.address}
              />
            </div>

            <div className="ca-field mb-4">
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
                className="ca-field"
                data-field="city"
                label="City / District*"
                value={form.city}
                onChange={(v) => setField("city", v)}
                error={errors.city}
              />
              <Field
                className="ca-field"
                data-field="state"
                label="State*"
                value={form.state}
                onChange={(v) => setField("state", v)}
                error={errors.state}
              />
            </div>


            <label className="ca-field flex items-center gap-2.5 mb-8 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={form.makeDefault}
                onChange={(e) => setField("makeDefault", e.target.checked)}
                className="w-4 h-4 rounded accent-[#0061C2] cursor-pointer"
              />
              <span className="text-sm text-slate-600">Make this my default address</span>
            </label>

            {/* Actions */}
            <div className="ca-field flex items-center gap-3">
              <button
                type="button"
                disabled={saveState !== "idle"}
                onClick={(e) => {
                  bumpButton(e.currentTarget);
                  navigate(-1);
                }}
                className="flex-1 sm:flex-none sm:px-8 py-3 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Cancel 
              </button>
              <button
                variant="primary"
                type="submit"
                disabled={saveState !== "idle"}
                onClick={(e) => saveState === "idle" && bumpButton(e.currentTarget)}
                className="flex-1 sm:flex-none sm:px-10 py-3 text-sm active:scale-95 transition-transform disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer bg-[#0061C2] text-white rounded-full"
              >
                {saveState === "saving" && (
                  <div className="flex gap-3">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </div>
                )}
                {saveState === "saved" && (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                )}
                {saveState === "idle" && "Save & Continue"}
              </button>
            </div>

            {/* {saveState === "saved" && <SavedBanner />} */}
          </form>

          {/* ── RIGHT: Order summary ── */}
          <aside className="ca-summary w-full lg:w-[38%] lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <h3 className="heading text-base sm:text-lg font-bold text-slate-900 mb-5">
                Price Details ({ORDER_ITEMS_COUNT} Items)
              </h3>

              <div className="space-y-3 mb-4">
                {priceRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{row.label}</span>
                    <span className={`font-medium ${row.accent || "text-slate-800"}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <hr className="border-dashed border-slate-200 mb-4" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <span className="text-lg font-bold text-[#0061C2]">₹5,159</span>
              </div>

          
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


/* ── Field — notched outline input with smooth label animation ──
   The label sits directly on the border line and visually breaks it
   (Material-style notch) via a white background patch behind the text.
   Border lives on the wrapper div, not the <input>, which is what makes
   the notch possible. */
function Field({ label, value, onChange, error, inputMode, className = "", "data-field": dataField }) {
  return (
    <div className={className} data-field={dataField}>
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-colors duration-200
            ${error ? "border-red-300" : "border-slate-200"}`}
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

        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-shadow duration-200
            [.relative:has(input:focus)_&]:shadow-[0_0_0_3px_rgba(0,97,194,0.12)]"
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500" style={{ animation: "fadeSlideIn 0.2s ease-out" }}>
          {error}
        </p>
      )}
    </div>
  );
}
