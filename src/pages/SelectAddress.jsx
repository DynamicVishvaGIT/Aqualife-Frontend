// pages/SelectDeliveryAddress.jsx
import { useState, useRef, useLayoutEffect } from "react";
import { ShieldCheck, MapPin, Home as HomeIcon, Building2, Plus, Pencil, Trash2 } from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import AddressFormModal from "../components/AddressFormModal";

const DEMO_ADDRESSES = [
  {
    id: "addr-1",
    name: "Priya Sharma",
    mobile: "9876543210",
    house: "B-402, Lakeview Residency",
    address: "Scott Woodward Road",
    locality: "Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    addressType: "Home",
    makeDefault: true,
  },
  {
    id: "addr-2",
    name: "Priya Sharma",
    mobile: "9876543210",
    house: "Tower C, 12th Floor",
    address: "Corporate Park",
    locality: "Bandra Kurla Complex",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    addressType: "Office",
    makeDefault: false,
  },
];

export default function SelectDeliveryAddress({
  addresses = DEMO_ADDRESSES,
  onContinue,
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [list, setList] = useState(addresses);
  const [selectedId, setSelectedId] = useState(
    () => addresses.find((a) => a.makeDefault)?.id ?? addresses[0]?.id ?? null,
  );
  const [removingId, setRemovingId] = useState(null);

  // Modal state — same modal serves both Add and Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const priceRows = [
    { label: "Total MRP", value: "₹12,599" },
    { label: "Discount on MRP", value: "− ₹2,921", accent: "text-emerald-600" },
    { label: "Delivery & Installation", value: "FREE", accent: "text-emerald-600" },
  ];

  const bumpButton = (el) => {
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  // Called by AddressFormModal with the validated form data — decides
  // create vs update based on whether we opened it for editing.
  const handleModalSave = (formData) => {
    setList((prev) => {
      let next;
      if (editingAddress) {
        next = prev.map((a) => (a.id === editingAddress.id ? { ...formData, id: editingAddress.id } : a));
      } else {
        const newAddress = { ...formData, id: `addr-${Date.now()}` };
        next = [...prev, newAddress];
      }
      // Only one default at a time
      if (formData.makeDefault) {
        const savedId = editingAddress ? editingAddress.id : next[next.length - 1].id;
        next = next.map((a) => ({ ...a, makeDefault: a.id === savedId }));
      }
      return next;
    });

    // Select whichever address was just added/edited
    setSelectedId(editingAddress ? editingAddress.id : null); // temp; corrected below once list updates
  };

  // After a save, make sure the just-saved address becomes selected even
  // for new adds (where we don't have the generated id until list updates)
  const handleModalSaveAndSelect = (formData) => {
    if (editingAddress) {
      handleModalSave(formData);
      setSelectedId(editingAddress.id);
    } else {
      const newId = `addr-${Date.now()}`;
      setList((prev) => {
        const newAddress = { ...formData, id: newId };
        let next = [...prev, newAddress];
        if (formData.makeDefault) {
          next = next.map((a) => ({ ...a, makeDefault: a.id === newId }));
        }
        return next;
      });
      setSelectedId(newId);
    }
  };

  const handleRemove = (id) => {
    const el = document.querySelector(`[data-address-id="${id}"]`);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      setList((prev) => prev.filter((a) => a.id !== id));
      setSelectedId((cur) => {
        if (cur !== id) return cur;
        const remaining = list.filter((a) => a.id !== id);
        return remaining[0]?.id ?? null;
      });
      setRemovingId(null);
    };

    if (prefersReducedMotion || !el) {
      finish();
      return;
    }

    setRemovingId(id);
    gsap.to(el, {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: finish,
    });
  };

  const handleContinue = () => {
    const selected = list.find((a) => a.id === selectedId);
    if (!selected) return;
    if (onContinue) onContinue(selected);
    else navigate("/checkout/payment");
  };

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.55 } })
        .fromTo(".sda-stepper", { opacity: 0, y: -10 }, { opacity: 1, y: 0 })
        .fromTo(".sda-card", { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.08 }, "-=0.35")
        .fromTo(".sda-summary", { opacity: 0, y: 18 }, { opacity: 1, y: 0 }, "-=0.4");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen pt-25 lg:pt-33 bg-[#F7FAFF]">
      <div className="primary-container pb-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* ── LEFT: Address list ── */}
          <div className="w-full lg:w-[62%]">
            <div className="flex items-center justify-between mb-5">
              <h1 className="heading text-xl sm:text-2xl font-bold text-slate-900">
                Select Delivery Address
              </h1>
              <button
                onClick={(e) => {
                  bumpButton(e.currentTarget);
                  openAddModal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0061C2] text-[#0061C2] text-sm font-semibold hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                Add New Address
              </button>
            </div>

            <div className="space-y-4">
              {list.map((addr) => (
                <AddressCard
                  key={addr.id}
                  addr={addr}
                  selected={selectedId === addr.id}
                  onSelect={() => setSelectedId(addr.id)}
                  onEdit={() => openEditModal(addr)}
                  onRemove={() => handleRemove(addr.id)}
                  isRemoving={removingId === addr.id}
                  bumpButton={bumpButton}
                />
              ))}

              <button
                onClick={(e) => {
                  bumpButton(e.currentTarget);
                  openAddModal();
                }}
                className="sda-card w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-slate-200 text-[#0061C2] font-semibold text-sm hover:border-[#0061C2] hover:bg-blue-50/40 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Plus size={16} />
                Add New Address
              </button>
            </div>
          </div>

          {/* ── RIGHT: Price summary ── */}
          <aside className="sda-summary w-full lg:w-[38%] lg:sticky lg:top-28 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <h3 className="heading text-base sm:text-lg font-bold text-slate-900 mb-5">
                Price Details (1 Item)
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
                <span className="text-lg font-bold text-[#0061C2]">₹9,678</span>
              </div>

              <button
                disabled={!selectedId}
                onClick={(e) => {
                  bumpButton(e.currentTarget);
                  handleContinue();
                }}
                className="w-full py-3.5 text-sm tracking-[0.05em] active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer bg-[#0061C2] text-white rounded-full font-semibold"
              >
                Continue
              </button>
            </div>
          </aside>
        </div>
      </div>

      <AddressFormModal
        isOpen={modalOpen}
        initialData={editingAddress}
        onClose={closeModal}
        onSave={handleModalSaveAndSelect}
      />
    </div>
  );
}

/* ── Saved address card ── */
function AddressCard({ addr, selected, onSelect, onEdit, onRemove, isRemoving, bumpButton }) {
  const TypeIcon = addr.addressType === "Office" ? Building2 : HomeIcon;

  return (
    <div
      data-address-id={addr.id}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`sda-card relative rounded-2xl border-2 p-5 sm:p-6 cursor-pointer transition-all duration-200
        ${isRemoving ? "pointer-events-none overflow-hidden" : ""}
        ${
          selected
            ? "border-[#0061C2] bg-blue-50/40 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
            ${selected ? "border-[#0061C2]" : "border-slate-300"}`}
        >
          {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#0061C2]" />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-bold text-slate-900 text-sm sm:text-base">{addr.name}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-[#0061C2] border border-[#0061C2]/40 rounded-full px-2 py-0.5">
              <TypeIcon size={10} />
              {addr.addressType.toUpperCase()}
            </span>
            {addr.makeDefault && (
              <span className="text-[10px] font-bold tracking-wide text-emerald-600 border border-emerald-300 rounded-full px-2 py-0.5">
                DEFAULT
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">
            {[addr.house, addr.address].filter(Boolean).join(", ")}
            <br />
            {addr.locality ? `${addr.locality}, ` : ""}
            {addr.city}, {addr.state} - {addr.pincode}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            Mobile: <span className="font-semibold text-slate-800">{addr.mobile}</span>
          </p>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-medium">
            <MapPin size={12} />
            Pay on Delivery available
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                bumpButton(e.currentTarget);
                onRemove();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold tracking-wide hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 size={13} />
              REMOVE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                bumpButton(e.currentTarget);
                onEdit();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold tracking-wide hover:border-[#0061C2] hover:text-[#0061C2] hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
            >
              <Pencil size={13} />
              EDIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}