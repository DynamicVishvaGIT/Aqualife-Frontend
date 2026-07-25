import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PINCODE_LOOKUP from "../static_data";

const BRAND = "#0061C2";
const BRAND_DARK = "#004a94";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MOBILE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

const TAGS = ["Home", "Work", "Other"];

const ADDRESSES = [
  {
    id: "addr-1",
    tag: "Work",
    name: "American Express",
    phone: "9123456789",
    house: "Office No 01, Om Sai Building",
    body: "Tinhat Naka Road, Daulat Nagar, near Axis Bank",
    locality: "Thane East",
    city: "Thane",
    state: "Maharashtra",
    pincode: "400603",
    makeDefault: false,
  },
  {
    id: "addr-2",
    tag: "Home",
    name: "Ken Williams",
    phone: "9876543210",
    house: "Flat No 302, Sai Krupa CHS",
    body: "Ghodbunder Road, Kasarvadavali",
    locality: "Thane West",
    city: "Thane",
    state: "Maharashtra",
    pincode: "400615",
    makeDefault: true,
  },
];

const emptyDraft = () => ({
  tag: "Home",
  name: "",
  phone: "",
  house: "",
  body: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  makeDefault: false,
});

const emptyErrors = () => ({
  name: "",
  phone: "",
  house: "",
  body: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
});

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const KebabIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ManageAddress = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const cardElsRef = useRef({});
  const animatedIds = useRef(new Set());
  const mountedRef = useRef(false);
  const menuWrapRef = useRef(null);

  const [addresses, setAddresses] = useState(ADDRESSES);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState(emptyErrors());
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | "found" | "unknown"

  useEffect(() => {
    if (prefersReducedMotion()) {
      mountedRef.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
      );
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.2 }
      );
    });
    mountedRef.current = true;
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setCardRef = (id) => (el) => {
    if (!el) return;
    cardElsRef.current[id] = el;
    if (!cardRefs.current.includes(el)) cardRefs.current.push(el);
    if (mountedRef.current && !animatedIds.current.has(id)) {
      animatedIds.current.add(id);
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    }
  };

  const bumpButton = (el) => {
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(el, { scale: 1 }, { scale: 0.96, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 });
  };

  const setDraftField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handlePincodeChange = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setDraftField("pincode", digits);
    if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: "" }));

    if (digits.length !== 6) {
      setPincodeStatus(null);
      return;
    }
    const match = PINCODE_LOOKUP[digits];
    if (match) {
      setDraft((prev) => ({ ...prev, pincode: digits, city: match.city, state: match.state }));
      setErrors((prev) => ({ ...prev, city: "", state: "" }));
      setPincodeStatus("found");
    } else {
      setPincodeStatus("unknown");
    }
  };

  const editButtonClass =
    "relative text-sm cursor-pointer font-medium transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full";

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3.5 py-2 text-sm text-gray-700 bg-white transition-all focus:outline-none";

  const focusHandlers = {
    onFocus: (e) => {
      e.currentTarget.style.borderColor = BRAND;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND}1A`;
    },
    onBlur: (e) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
    },
  };

  const validateDraft = () => {
    const next = emptyErrors();
    if (!draft.name.trim())                       next.name    = "Required";
    if (!MOBILE_RE.test(draft.phone.trim()))      next.phone   = "Enter a valid 10-digit mobile number";
    if (!draft.house.trim())                      next.house   = "Required";
    if (!draft.body.trim())                       next.body    = "Required";
    if (!draft.locality.trim())                   next.locality = "Required";
    if (!draft.city.trim())                       next.city    = "Required";
    if (!draft.state.trim())                      next.state   = "Required";
    if (!PINCODE_RE.test(draft.pincode.trim()))   next.pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const startAdd = (e) => {
    bumpButton(e.currentTarget);
    setOpenMenuId(null);
    setDraft(emptyDraft());
    setErrors(emptyErrors());
    setPincodeStatus(null);
    setEditingId("new");
  };

  const startEdit = (addr) => {
    setOpenMenuId(null);
    setDraft({
      tag: addr.tag,
      name: addr.name,
      phone: addr.phone,
      house: addr.house,
      body: addr.body,
      locality: addr.locality,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      makeDefault: addr.makeDefault,
    });
    setErrors(emptyErrors());
    setPincodeStatus(null);
    setEditingId(addr.id);
  };

  const cancelForm = (e) => {
    if (e) bumpButton(e.currentTarget);
    setEditingId(null);
    setErrors(emptyErrors());
    setPincodeStatus(null);
  };

  const saveForm = (e) => {
    bumpButton(e.currentTarget);
    if (!validateDraft()) return;

    const cleaned = {
      tag: draft.tag,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      house: draft.house.trim(),
      body: draft.body.trim(),
      locality: draft.locality.trim(),
      city: draft.city.trim(),
      state: draft.state.trim(),
      pincode: draft.pincode.trim(),
      makeDefault: draft.makeDefault,
    };

    if (editingId === "new") {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => [...prev, { id, ...cleaned }]);
    } else {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editingId ? { ...addr, ...cleaned } : addr))
      );
    }
    setEditingId(null);
    setPincodeStatus(null);
  };

  const removeAddress = (id) => {
    setOpenMenuId(null);
    const cardEl = cardElsRef.current[id];
    if (!prefersReducedMotion() && cardEl) {
      gsap.to(cardEl, {
        opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
        duration: 0.3, ease: "power2.in",
        onComplete: () => {
          delete cardElsRef.current[id];
          setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        },
      });
    } else {
      delete cardElsRef.current[id];
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  const renderForm = () => (
    <div className="border border-gray-200 rounded-xl px-5 py-4 mb-4">
      {/* Tag pills */}
      <div className="flex items-center gap-2 mb-4">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className="px-3 py-1.5 rounded-full border text-xs font-medium transition-colors"
            style={
              draft.tag === t
                ? { borderColor: BRAND, backgroundColor: `${BRAND}0D`, color: BRAND }
                : { borderColor: "#E5E7EB", color: "#374151" }
            }
            onClick={() => setDraft((prev) => ({ ...prev, tag: t }))}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <input
            type="text"
            value={draft.name}
            placeholder="Full name*"
            onChange={(e) => setDraftField("name", e.target.value)}
            className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
            {...focusHandlers}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={draft.phone}
            placeholder="Mobile number*"
            onChange={(e) => setDraftField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            className={`${inputClass} ${errors.phone ? "border-red-400" : ""}`}
            {...focusHandlers}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* House */}
      <div className="mb-3">
        <input
          type="text"
          value={draft.house}
          placeholder="House number / Tower / Block*"
          onChange={(e) => setDraftField("house", e.target.value)}
          className={`${inputClass} ${errors.house ? "border-red-400" : ""}`}
          {...focusHandlers}
        />
        {errors.house && <p className="text-xs text-red-500 mt-1">{errors.house}</p>}
      </div>

      {/* Address body */}
      <div className="mb-3">
        <textarea
          value={draft.body}
          placeholder="Address (locality, building, street)*"
          rows={3}
          onChange={(e) => setDraftField("body", e.target.value)}
          className={`${inputClass} resize-none ${errors.body ? "border-red-400" : ""}`}
          {...focusHandlers}
        />
        {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
      </div>

      {/* Locality */}
      <div className="mb-3">
        <input
          type="text"
          value={draft.locality}
          placeholder="Locality / Town*"
          onChange={(e) => setDraftField("locality", e.target.value)}
          className={`${inputClass} ${errors.locality ? "border-red-400" : ""}`}
          {...focusHandlers}
        />
        {errors.locality && <p className="text-xs text-red-500 mt-1">{errors.locality}</p>}
      </div>

      {/* Pincode + City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={draft.pincode}
            placeholder="Pincode*"
            onChange={(e) => handlePincodeChange(e.target.value)}
            className={`${inputClass} ${errors.pincode ? "border-red-400" : ""}`}
            {...focusHandlers}
          />
          {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
          {pincodeStatus === "found" && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckIcon /> Auto-filled
            </p>
          )}
          {pincodeStatus === "unknown" && (
            <p className="text-xs text-slate-400 mt-1">Not recognized — fill manually</p>
          )}
        </div>
        <div>
          <input
            type="text"
            value={draft.city}
            placeholder="City / District*"
            onChange={(e) => setDraftField("city", e.target.value)}
            className={`${inputClass} ${errors.city ? "border-red-400" : ""}`}
            {...focusHandlers}
          />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <input
            type="text"
            value={draft.state}
            placeholder="State*"
            onChange={(e) => setDraftField("state", e.target.value)}
            className={`${inputClass} ${errors.state ? "border-red-400" : ""}`}
            {...focusHandlers}
          />
          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
        </div>
      </div>

      {/* Make default */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer select-none w-fit">
        <input
          type="checkbox"
          checked={draft.makeDefault}
          onChange={(e) => setDraft((prev) => ({ ...prev, makeDefault: e.target.checked }))}
          className="w-4 h-4 rounded accent-[#0061C2] cursor-pointer"
        />
        <span className="text-sm text-gray-600">Make this my default address</span>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-4 justify-end">
        <button type="button" className={editButtonClass} style={{ color: "#6B7280" }} onClick={cancelForm}>
          Cancel
        </button>
        <button type="button" className={editButtonClass} style={{ color: BRAND }} onClick={saveForm}>
          Save Address
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 sm:px-8 py-7 transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-base font-semibold text-gray-800">Manage Addresses</h2>
        </div>

        {editingId === "new" ? (
          renderForm()
        ) : (
          <button
            type="button"
            className="w-full cursor-pointer flex items-center gap-2 border border-gray-200 rounded-xl px-5 py-4 mb-4 text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ color: BRAND }}
            onClick={startAdd}
          >
            <PlusIcon />
            Add a New Address
          </button>
        )}

        <div className="flex flex-col gap-4">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <div key={addr.id}>{renderForm()}</div>
            ) : (
              <div
                key={addr.id}
                ref={setCardRef(addr.id)}
                className="relative border border-gray-200 rounded-xl px-5 py-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                      {addr.tag}
                    </span>
                    {addr.makeDefault && (
                      <span className="text-xs font-medium rounded-full px-3 py-1" style={{ backgroundColor: `${BRAND}0D`, color: BRAND }}>
                        Default
                      </span>
                    )}
                  </div>

                  <div className="relative" ref={openMenuId === addr.id ? menuWrapRef : null}>
                    <button
                      type="button"
                      className="w-7 h-7 flex cursor-pointer items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenMenuId((prev) => (prev === addr.id ? null : addr.id))}
                    >
                      <KebabIcon />
                    </button>

                    {openMenuId === addr.id && (
                      <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-20">
                        <button
                          type="button"
                          className="w-full cursor-pointer text-left text-sm px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => startEdit(addr)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="w-full cursor-pointer text-left text-sm px-3 py-2 text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => removeAddress(addr.id)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-800 mb-1.5">
                  {addr.name} — {addr.phone}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {addr.house}, {addr.body}, {addr.locality}, {addr.city}, {addr.state}{" "}
                  <span className="font-semibold text-gray-700">— {addr.pincode}</span>
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAddress;