import { useRef, useLayoutEffect } from "react";
import { Sparkles, ShieldCheck, Handshake } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    icon: Sparkles,
    title: "Aqualife Advantage",
    description:
      "Largest Manufacturer & Market Leader in RO Water Purifier with Large Sales and Service Network",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brand",
    description: "Honored with Numerous International Certifications and Awards",
  },
  {
    icon: Handshake,
    title: "25 Years of Trust by Millions",
    description: "Most Preferred RO & Home Appliances Brands in India",
  },
];

export default function WhyChoose() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const itemRefs   = useRef([]);

  useLayoutEffect(() => {
    // Small timeout ensures DOM is fully painted before GSAP reads layout
    const timer = setTimeout(() => {
      const items = itemRefs.current.filter(Boolean);

      const ctx = gsap.context(() => {

        // ── Initial hidden state ──
        gsap.set(headingRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.97,
        });

        gsap.set(items, {
          opacity: 0,
          y: 44,
          scale: 0.95,
        });

        // ── Timeline ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });

        // Heading animates in first
        tl.to(headingRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        });

        // Cards stagger in, overlapping the heading anim
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.14,
          },
          "-=0.3",
        );
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F5F9FF] py-10 sm:py-12 lg:py-14">
      <div className="primary-container">

        {/* ── Heading ── */}
        <h2
          ref={headingRef}
          className="text-2xl heading sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-10"
        >
          Why Choose Aqualife
        </h2>

        {/* ── Reason cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
          {REASONS.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              ref={(el) => (itemRefs.current[index] = el)}
              className="flex items-start gap-4"
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                <Icon size={36} strokeWidth={1.2} className="text-slate-700" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[15px] heading sm:text-base font-bold text-slate-900 leading-snug mb-1.5">
                  {title}
                </h3>
                <p className="text-slate-400 text-[13px] sm:text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}