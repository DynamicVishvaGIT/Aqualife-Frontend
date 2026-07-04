import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Modal
 * -----------------------------------------------------------------------
 * A single reusable modal for the whole project — styled to match the
 * Aqualife theme (blue-600 accents, rounded-2xl surfaces, #F4F8FC panels,
 * gray-900 headings / gray-500 body text) used across the water-softener
 * sections.
 *
 * Interactive details on top of the base modal:
 *   - Proper open AND close animations (previous version only animated
 *     in — closing just vanished instantly). Backdrop fades, dialog
 *     scales/slides both ways, with a springy "overshoot" easing on open.
 *   - Swipe-to-dismiss on mobile: drag the handle (or header) down past
 *     ~90px and release to close, like a native bottom sheet. Dragging
 *     less snaps back with a spring.
 *   - Header grows a subtle shadow the moment the body content is
 *     scrolled, so long content doesn't visually merge into the title.
 *   - Close button rotates + scales on hover/press instead of a flat
 *     color change.
 *
 * USAGE
 * -----------------------------------------------------------------------
 *   const [open, setOpen] = useState(false);
 *
 *   <Modal
 *     isOpen={open}
 *     onClose={() => setOpen(false)}
 *     title="Request a Free Water Test"
 *     size="md"
 *     footer={
 *       <>
 *         <button onClick={() => setOpen(false)} className="btn-secondary">
 *           Cancel
 *         </button>
 *         <button onClick={handleSubmit} className="btn-primary">
 *           Submit
 *         </button>
 *       </>
 *     }
 *   >
 *     <p>Modal body content goes here.</p>
 *   </Modal>
 *
 * PROPS
 * -----------------------------------------------------------------------
 *   isOpen              boolean            controls visibility
 *   onClose             () => void         called on backdrop click, ESC, or the X button
 *   title               string | node      optional header text
 *   children            node               body content
 *   footer              node               optional footer (buttons, etc.)
 *   size                'sm'|'md'|'lg'|'xl'|'full'   default 'md'
 *   closeOnOverlayClick boolean            default true
 *   showCloseButton     boolean            default true
 * -----------------------------------------------------------------------
 */

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100%-2rem)]",
};

const CLOSE_ANIMATION_MS = 180;
const DRAG_CLOSE_THRESHOLD = 90; // px, mobile swipe-down-to-dismiss

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`);

  // Mount/unmount is decoupled from isOpen so the close animation can
  // actually play before the dialog leaves the DOM.
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Swipe-to-dismiss drag state (mobile bottom sheet)
  const dragState = useRef({ dragging: false, startY: 0, deltaY: 0 });
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const runClose = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      setDragY(0);
      onClose?.();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setDragY(0);
    } else if (shouldRender && !isClosing) {
      // isOpen flipped false from outside (not via runClose) — still animate out
      setIsClosing(true);
      const t = window.setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        setDragY(0);
      }, CLOSE_ANIMATION_MS);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on ESC
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") runClose();

      // basic focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [runClose]
  );

  // Lock body scroll + wire up ESC listener while open
  useEffect(() => {
    if (!shouldRender) return;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [shouldRender, handleKeyDown]);

  // Header shadow once the body scrolls
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 2);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [shouldRender]);

  // --- Swipe-to-dismiss (mobile) ---
  const onDragStart = (clientY) => {
    dragState.current = { dragging: true, startY: clientY, deltaY: 0 };
    setIsDragging(true);
  };
  const onDragMove = (clientY) => {
    if (!dragState.current.dragging) return;
    const delta = Math.max(0, clientY - dragState.current.startY);
    dragState.current.deltaY = delta;
    setDragY(delta);
  };
  const onDragEnd = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    setIsDragging(false);
    if (dragState.current.deltaY > DRAG_CLOSE_THRESHOLD) {
      runClose();
    } else {
      setDragY(0);
    }
  };

  const handleTouchStart = (e) => onDragStart(e.touches[0].clientY);
  const handleTouchMove = (e) => onDragMove(e.touches[0].clientY);
  const handleTouchEnd = () => onDragEnd();

  if (!shouldRender) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-labelledby={title ? titleId.current : undefined}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100 animate-[fadeIn_0.18s_ease-out]"
        }`}
        onClick={closeOnOverlayClick ? runClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`relative w-full ${SIZE_CLASSES[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl
          max-h-[90vh] sm:max-h-[85vh] flex flex-col outline-none
          ${isDragging ? "" : "transition-transform duration-200 ease-out"}
          ${
            isClosing
              ? "opacity-0 translate-y-6 sm:translate-y-0 sm:scale-95"
              : "opacity-100 animate-[modalSlideUp_0.22s_cubic-bezier(0.34,1.2,0.64,1)] sm:animate-[modalScaleIn_0.18s_cubic-bezier(0.34,1.4,0.64,1)]"
          }`}
        style={
          dragY
            ? { transform: `translateY(${dragY}px)`, opacity: Math.max(1 - dragY / 400, 0.4) }
            : undefined
        }
      >
        {/* Drag handle, mobile-only, bottom-sheet affordance + swipe-to-dismiss */}
        <div
          className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-start justify-between gap-4 px-5 sm:px-6 pt-2 sm:pt-6 pb-4 border-b transition-shadow duration-200 ${
              isScrolled ? "border-gray-100 shadow-[0_4px_10px_-8px_rgba(0,0,0,0.25)]" : "border-transparent"
            }`}
          >
            {title && (
              <h2
                id={titleId.current}
                className="text-lg sm:text-xl font-bold text-gray-900 leading-snug"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={runClose}
                aria-label="Close"
                className="group flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 transition-all duration-150"
              >
                <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          ref={bodyRef}
          className="px-5 sm:px-6 py-5 overflow-y-auto text-sm sm:text-[15px] text-gray-600 leading-relaxed"
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-4 border-t border-gray-100 bg-[#F4F8FC] rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/**
 * Add these keyframes once to your global CSS (e.g. index.css /
 * globals.css) so the open animations above work — the close animation
 * is handled entirely by the `transition-transform`/`transition-opacity`
 * classes, so it needs no keyframes.
 *

 */