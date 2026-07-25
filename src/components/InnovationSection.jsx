import { useEffect, useRef } from "react";
import { Droplets, Wrench, HeadphonesIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaveAnimation from "./WaveAnimation";
import waveImg from "../assets/water_waves.webp";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Droplets,
    title: "7 Days No Risk Trial",
    description:
      "Experience pure, safe drinking water with confidence. Easy installation, no hidden charges, and dedicated service support to get you started.",
  },
  {
    icon: Wrench,
    title: "Free Lifetime Maintenance",
    description:
      "Enjoy complete peace of mind with complimentary maintenance services, ensuring your water purifier performs at its best for years to come.",
  },
  {
    icon: HeadphonesIcon,
    title: "Smart Support",
    description:
      "Keep an eye on filter health, receive timely service reminders, and enjoy seamless support through our easy-to-use mobile app.",
  },
];

export default function InnovationSection() {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const cardsRef    = useRef([]);
  const footerRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Set initial states (mirroring your showContent keyframe start) ──
      const contentEls = [
        headingRef.current,
        ...cardsRef.current,
        footerRef.current,
      ].filter(Boolean);

      gsap.set(contentEls, {
        y: 60,
        opacity: 0,
        filter: "blur(8px)",
      });

      // ── Shared ScrollTrigger timeline ────────────────────────────────────
      // Delays mirror your CSS pattern:
      //   heading  → 0.4 s
      //   card 1   → 0.6 s
      //   card 2   → 0.8 s
      //   card 3   → 1.0 s
      //   footer   → 1.2 s
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
           start: "top 80%",
          end: "center 30%",
          scrub: false,   // fire once, not scrubbed — matches CSS animation feel
          toggleActions: "play play play play",
        },
      });

      tl.to(headingRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
      }, 0.4)

      cardsRef.current.forEach((card, i) => {
        tl.to(card, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
        }, 0.4 + 0.2 * (i + 1));   // 0.6, 0.8, 1.0
      });

      tl.to(footerRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
      }, 0.4 + 0.2 * (FEATURES.length + 1));  // 1.2
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F6FAFF]">

      <WaveAnimation
        imageUrl={waveImg}
        height="clamp(500px, 22vw, 400px)"
        amplitude={0.08}
        frequency={1}
        speed={0.7}
        mouseTilt={true}
        fullBleed={true}
        scrollScrub={0.6}
        scrollStart="top 50%"
        scrollEnd="top 20%"
      />


      <div className="primary-container text-center -mt-72 relative z-10">

        <h2
          ref={headingRef}
          className="heading text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold mt-10 sm:mt-12 mb-10 sm:mb-4 text-slate-900 leading-snug"
        >
          Innovation That Keeps Your
          <br />
          Water Pure
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 lg:gap-10 mb-12 sm:mb-16">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="flex flex-col items-center text-center px-2 sm:px-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-5 transition-all duration-300 hover:bg-blue-50">
                <Icon size={44} strokeWidth={1.25} className="text-blue-500" />
              </div>

              <h3 className="heading text-base sm:text-lg font-bold text-slate-900 mb-3">
                {title}
              </h3>

              <p className="text-[#3D5B79] text-sm sm:text-[14.5px] lg:text-[16px] leading-relaxed max-w-[360px]">
                {description}
              </p>
            </div>
          ))}
        </div>

        <p
          ref={footerRef}
          className="text-slate-500 text-sm sm:text-[15px] pb-12 sm:pb-16"
        >
          The machine and servicing are both managed and provided by Aqualife Ever.
        </p>

      </div>
    </section>
  );
}