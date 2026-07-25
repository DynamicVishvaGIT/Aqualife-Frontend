import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const BRAND = "#0061C2";
const BRAND_DARK = "#004a94";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

const ProfileInfo = () => {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "male",
  });

  // Draft holds in-progress edits per section so Cancel can discard them.
  const [draft, setDraft] = useState(form);

  const [editing, setEditing] = useState({
    personal: false,
    email: false,
    mobile: false,
  });

  const [errors, setErrors] = useState({ email: "", mobile: "" });

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
      );

      gsap.fromTo(
        sectionRefs.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const addSection = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const bumpButton = (el) => {
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  };

  const editButtonClass =
    "relative cursor-pointer  select-none  text-sm font-medium transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full";

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

  const inputClass = (isEditable) =>
    `w-full border rounded-md px-4 py-2.5 text-sm text-gray-700 transition-all focus:outline-none ${
      isEditable
        ? "bg-white border-gray-300"
        : "bg-gray-50 border-gray-200 cursor-not-allowed"
    }`;

  const startEditing = (section, e) => {
    bumpButton(e.currentTarget);
    setDraft(form);
    setErrors({ email: "", mobile: "" });
    setEditing((prev) => ({ ...prev, [section]: true }));
  };

  const cancelEditing = (section, e) => {
    bumpButton(e.currentTarget);
    setDraft((prev) => ({ ...prev, ...form }));
    setErrors((prev) => ({ ...prev, [section === "personal" ? "email" : section]: "" }));
    setEditing((prev) => ({ ...prev, [section]: false }));
  };

  const savePersonal = (e) => {
    bumpButton(e.currentTarget);
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;
    setForm((prev) => ({
      ...prev,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      gender: draft.gender,
    }));
    setEditing((prev) => ({ ...prev, personal: false }));
  };

  const saveEmail = (e) => {
    bumpButton(e.currentTarget);
    if (!EMAIL_RE.test(draft.email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      return;
    }
    setForm((prev) => ({ ...prev, email: draft.email.trim() }));
    setErrors((prev) => ({ ...prev, email: "" }));
    setEditing((prev) => ({ ...prev, email: false }));
  };

  const saveMobile = (e) => {
    bumpButton(e.currentTarget);
    if (!MOBILE_RE.test(draft.mobile.trim())) {
      setErrors((prev) => ({ ...prev, mobile: "Enter a valid 10-digit mobile number" }));
      return;
    }
    setForm((prev) => ({ ...prev, mobile: draft.mobile.trim() }));
    setErrors((prev) => ({ ...prev, mobile: "" }));
    setEditing((prev) => ({ ...prev, mobile: false }));
  };

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 sm:px-8 py-7 transition-shadow duration-300 hover:shadow-md">
        {/* Personal Information */}
        <div ref={addSection}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-base font-semibold text-gray-800">Personal Information</h2>
            {editing.personal ? (
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  className={editButtonClass}
                  style={{ color: "#6B7280" }}
                  onClick={(e) => cancelEditing("personal", e)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={editButtonClass}
                  style={{ color: BRAND }}
                  onClick={savePersonal}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={editButtonClass}
                style={{ color: BRAND }}
                onClick={(e) => startEditing("personal", e)}
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={editing.personal ? draft.firstName : form.firstName}
                disabled={!editing.personal}
                placeholder="First name"
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className={inputClass(editing.personal)}
                {...focusHandlers}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={editing.personal ? draft.lastName : form.lastName}
                disabled={!editing.personal}
                placeholder="Last name"
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className={inputClass(editing.personal)}
                {...focusHandlers}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-3">Your Gender</p>
            <div className="flex items-center gap-3">
              {["male", "female"].map((option) => {
                const activeGender = editing.personal ? draft.gender : form.gender;
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
                      editing.personal ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                    }`}
                    style={
                      activeGender === option
                        ? { borderColor: BRAND, backgroundColor: `${BRAND}0D`, color: BRAND }
                        : { borderColor: "transparent", color: "#374151" }
                    }
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={activeGender === option}
                      disabled={!editing.personal}
                      onChange={() => setDraft((prev) => ({ ...prev, gender: option }))}
                      className="w-4 h-4"
                      style={{ accentColor: BRAND }}
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={addSection} className="border-t border-gray-100 my-6" />

        {/* Email Address */}
        <div ref={addSection}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-800">Email Address</h2>
            {editing.email ? (
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  className={editButtonClass}
                  style={{ color: "#6B7280" }}
                  onClick={(e) => cancelEditing("email", e)}
                >
                  Cancel
                </button>
                <button type="button" className={editButtonClass} style={{ color: BRAND }} onClick={saveEmail}>
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={editButtonClass}
                style={{ color: BRAND }}
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.color = BRAND)}
                onClick={(e) => startEditing("email", e)}
              >
                Edit
              </button>
            )}
          </div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={editing.email ? draft.email : form.email}
            disabled={!editing.email}
            onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
            className={inputClass(editing.email)}
            placeholder="Email Address"
            {...focusHandlers}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
        </div>

        <div ref={addSection} className="border-t border-gray-100 my-6" />

        {/* Mobile Number */}
        <div ref={addSection}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-800">Mobile Number</h2>
            {editing.mobile ? (
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  className={editButtonClass}
                  style={{ color: "#6B7280" }}
                  onClick={(e) => cancelEditing("mobile", e)}
                >
                  Cancel
                </button>
                <button type="button" className={editButtonClass} style={{ color: BRAND }} onClick={saveMobile}>
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={editButtonClass}
                style={{ color: BRAND }}
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.color = BRAND)}
                onClick={(e) => startEditing("mobile", e)}
              >
                Edit
              </button>
            )}
          </div>
          <label htmlFor="mobile" className="sr-only">
            Mobile number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={editing.mobile ? draft.mobile : form.mobile}
            disabled={!editing.mobile}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            className={inputClass(editing.mobile)}
            placeholder="Mobile Number"
            {...focusHandlers}
          />
          {errors.mobile && <p className="text-xs text-red-500 mt-1.5">{errors.mobile}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;