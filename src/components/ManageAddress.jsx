import { useEffect, useRef, useState } from "react";
import { gsap } from "https://cdn.skypack.dev/gsap";

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
    body: "Office No 01, Om Sai Building, Tinhat Naka Road, Daulat Nagar, near Axis Bank, Thane East, Thane, Maharashtra",
    pincode: "400603",
  },
  {
    id: "addr-2",
    tag: "Home",
    name: "Ken Williams",
    phone: "9876543210",
    body: "Flat No 302, Sai Krupa CHS, Ghodbunder Road, Kasarvadavali, Thane West, Thane, Maharashtra",
    pincode: "400615",
  },
];

const emptyDraft = () => ({
  tag: "Home",
  name: "",
  phone: "",
  body: "",
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

const ManageAddress = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const cardElsRef = useRef({});
  const animatedIds = useRef(new Set());
  const mountedRef = useRef(false);
  const menuWrapRef = useRef(null);

  const [addresses, setAddresses] = useState(ADDRESSES);
  const [openMenuId, setOpenMenuId] = useState(null);

  // "new" while the add-address form is open, or an address id while editing that card
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({ phone: "", pincode: "" });

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
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    });

    mountedRef.current = true;
    return () => ctx.revert();
  }, []);

  // close the open kebab menu on outside click
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
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  };

  const bumpButton = (el) => {
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 0.96, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }
    );
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
    const next = { phone: "", pincode: "" };
    if (!MOBILE_RE.test(draft.phone.trim())) next.phone = "Enter a valid 10-digit mobile number";
    if (!PINCODE_RE.test(draft.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return !next.phone && !next.pincode && draft.name.trim() && draft.body.trim();
  };

  const startAdd = (e) => {
    bumpButton(e.currentTarget);
    setOpenMenuId(null);
    setDraft(emptyDraft());
    setErrors({ phone: "", pincode: "" });
    setEditingId("new");
  };

  const startEdit = (addr) => {
    setOpenMenuId(null);
    setDraft({ tag: addr.tag, name: addr.name, phone: addr.phone, body: addr.body, pincode: addr.pincode });
    setErrors({ phone: "", pincode: "" });
    setEditingId(addr.id);
  };

  const cancelForm = (e) => {
    if (e) bumpButton(e.currentTarget);
    setEditingId(null);
    setErrors({ phone: "", pincode: "" });
  };

  const saveForm = (e) => {
    bumpButton(e.currentTarget);
    if (!validateDraft()) return;

    const cleaned = {
      tag: draft.tag,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      body: draft.body.trim(),
      pincode: draft.pincode.trim(),
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
  };

  const removeAddress = (id) => {
    setOpenMenuId(null);
    const cardEl = cardElsRef.current[id];
    if (!prefersReducedMotion() && cardEl) {
      gsap.to(cardEl, {
        opacity: 0,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: "power2.in",
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
      <div className="flex items-center gap-2 mb-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          value={draft.name}
          placeholder="Full name"
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
          className={inputClass}
          {...focusHandlers}
        />
        <div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={draft.phone}
            placeholder="Mobile number"
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
            }
            className={inputClass}
            {...focusHandlers}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <textarea
        value={draft.body}
        placeholder="Address (house no, street, landmark, area)"
        rows={3}
        onChange={(e) => setDraft((prev) => ({ ...prev, body: e.target.value }))}
        className={`${inputClass} mb-3 resize-none`}
        {...focusHandlers}
      />

      <div className="mb-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={draft.pincode}
          placeholder="Pincode"
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))
          }
          className={`${inputClass} sm:w-40`}
          {...focusHandlers}
        />
        {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
      </div>

      <div className="flex items-center gap-4 justify-end">
        <button
          type="button"
          className={editButtonClass}
          style={{ color: "#6B7280" }}
          onClick={cancelForm}
        >
          Cancel
        </button>
        <button
          type="button"
          className={editButtonClass}
          style={{ color: BRAND }}
          onClick={saveForm}
        >
          Save Address
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 sm:px-8 py-7 transition-shadow duration-300 hover:shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-base font-semibold text-gray-800">Manage Addresses</h2>
        </div>

        {/* Add new address */}
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

        {/* Address list */}
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
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    {addr.tag}
                  </span>

                  <div className="relative" ref={openMenuId === addr.id ? menuWrapRef : null}>
                    <button
                      type="button"
                      className="w-7 h-7 flex cursor-pointer items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setOpenMenuId((prev) => (prev === addr.id ? null : addr.id))
                      }
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
                  {addr.name} - {addr.phone}
                </p>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {addr.body} <span className="font-semibold text-gray-700">- {addr.pincode}</span>
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