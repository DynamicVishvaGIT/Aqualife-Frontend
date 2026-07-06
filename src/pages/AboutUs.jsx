// @refresh reset
import { useEffect, useRef } from "react";
import { Droplet, Users, Briefcase, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import aboutHeroImg from "../assets/about_banner_1.png";
import aboutImg     from "../assets/about_banner_2.png";
import visionImg    from "../assets/about_banner_3.jpg";
import missionImg   from "../assets/about_banner_4.jpg";
import familyImg    from "../assets/familyImg.png";
import trustImg     from "../assets/Home_Banner.png";
import coolerImg    from "../assets/water-cooler_2.png";
import Breadcrumb   from "../components/Breadcrumb";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STATS = [
  { icon: Droplet,   title: "Trusted",             desc: "AQUALIFE-EVER is a trusted and leading Health & Hygiene brand committed" },
  { icon: Users,     title: "10000+ Customers",     desc: "we have served more than 10,000 customers, providing effective household solutions" },
  { icon: Briefcase, title: "13 Years Experience",  desc: "Delivering quality products and services. For over 13 years," },
];

const aboutSection = [
  "We, at AQUACOOL CO. PVT. LTD. believe that we only succeed by serving our customers and fulfilling their needs upto their satisfaction.",
  "At AQUACOOL CO. PVT. LTD., customer satisfaction is at the heart of everything we do. We strive to provide efficient, reliable, and high-quality services while continuously pursuing excellence and leadership in our field.",
  "Our experience, commitment to quality, and strong sense of social responsibility enable us to deliver exceptional results with sincerity, dedication, and zero compromise.",
  "In future we see ourselves as a recognised and most reliable solution for different tasks at one station. We deal with Air Treatment, Water Treatment such as Water Purifiers, Water Coolers, HVAC System AHU. We also deal with Manpower Outsourcing, Electrical, DG set, Solar system, Fire Fighting, Sewage Treatment Plant (STP).",
  "We take privilege to stay connected with all our valuable customers from various sectors such as Government, Semi Government, Private and Public Corporate sectors on PAN India Basis for last 13 years.",
];

const VISION_MISSION = [
  {
    key: "vision",
    label: "Vision",
    image: visionImg,
    theme: "dark",
    paragraphs: [
      "To become the most recognized and reliable one-stop solution provider for a wide range of services across India.",
      "We aim to expand our presence in Air Treatment, Water Treatment, Water Purification, Water Cooling Systems, HVAC & AHU Solutions, Manpower Outsourcing, Electrical Services, DG Sets, Solar Systems, Fire Fighting Systems, and Sewage Treatment Plants (STP), while building long-term relationships with clients across Government, Semi-Government, Public, and Private sectors.",
    ],
  },
  {
    key: "mission",
    label: "Mission",
    image: missionImg,
    theme: "light",
    paragraphs: [
      "To grow our organization with honesty, integrity, and a customer-first approach while consistently delivering innovative and tailored solutions.",
      "We are committed to exceeding customer expectations through prompt action, superior service quality, and continuous improvement. By combining dedicated teamwork, intelligent execution, and uncompromising standards, we strive to provide products and services that create lasting value for our customers.",
    ],
  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function renderWithEmphasis(text) {
  const target = "AQUACOOL CO. PVT. LTD.";
  const parts  = text.split(target);
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, i) => {
    acc.push(part);
    if (i < parts.length - 1)
      acc.push(<strong key={i} className="font-semibold text-slate-900">{target}</strong>);
    return acc;
  }, []);
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="w-full pt-10 sm:py-8 lg:pt-12">
      <div className="primary-container">
        <h2 className="heading text-3xl sm:text-4xl font-bold text-slate-900 mb-8 sm:mb-10">
          About Us
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="w-full overflow-hidden rounded-2xl">
            <img
              src={aboutImg}
              alt="Aqualife water purifiers on display"
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[520px] object-cover"
            />
          </div>
          <div className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-slate-700">
            {aboutSection.map((para, i) => (
              <p key={i}>{renderWithEmphasis(para)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section className="w-full">
      {VISION_MISSION.map(({ key, label, image, theme, paragraphs }) => {
        const isDark = theme === "dark";
        return (
          <div
            key={key}
            className="relative w-full h-[420px] sm:h-[480px] lg:h-[700px] 2xl:h-[1100px] overflow-hidden"
          >
            <img src={image} alt={`${label} - Aqualife`} className="absolute inset-0 h-full w-full object-cover" />
            <div className={isDark
              ? "absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 sm:to-transparent"
              : "absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/10 sm:to-transparent"}
            />
            <div className="relative z-10 h-full primary-container flex items-center">
              <div className="max-w-xs sm:max-w-sm lg:max-w-md">
                <h2 className={`heading text-3xl sm:text-4xl lg:text-[42px] font-bold mb-4 sm:mb-5 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {label}
                </h2>
                <div className={`flex flex-col gap-4 text-sm sm:text-base leading-relaxed ${isDark ? "text-white/90" : "text-slate-700"}`}>
                  {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-5 sm:py-8 lg:py-10">
      <div className="primary-container">
        <h2 className="heading text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
          Why Choose Us - <span className="text-blue-600">AQUALIFE</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 sm:gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[400px] 2xl:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden">
              <img src={familyImg} alt="Aqualife family with water purifiers" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute top-2 left-2 right-4 sm:top-3 sm:left-2 sm:right-auto sm:max-w-xs">
                <div className="rounded-xl py-3 sm:px-5 sm:py-4">
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                    <span className="font-semibold">13+</span> years of experience and{" "}
                    <span className="font-semibold">10,000+</span> happy customers{" "}
                    <span className="font-semibold">across India</span>, delivering trusted and energy-efficient water systems.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[400px] 2xl:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden">
              <img src={trustImg} alt="Aqualife-Ever trusted brand" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6">
                <p className="max-w-[220px] sm:max-w-[260px] text-sm sm:text-base leading-relaxed text-white">
                  <span className="font-semibold">AQUALIFE-EVER</span> is a trusted and leading{" "}
                  <span className="font-semibold">Health &amp; Hygiene</span> brand committed.
                </p>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="relative w-full h-[300px] sm:h-[380px] lg:h-auto rounded-2xl sm:rounded-3xl bg-[#F0F0F0] border border-[#F0F0F0] overflow-hidden flex flex-col">
            <div className="px-5 pt-6 sm:px-6 sm:pt-7 text-center">
              <h3 className="heading text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Experience Pure Water with Advanced Cooling Technology
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Smart RO &amp; UV purification combined with powerful cooling for safe and refreshing hydration.
              </p>
            </div>
            <div className="relative flex-1 mt-4">
              <img src={coolerImg} alt="Aqualife stainless steel water cooler" className="absolute inset-0 h-full w-full object-contain object-bottom p-4 sm:p-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function AboutUs() {
  /* ── Hero animation refs ── */
  const heroWrapRef     = useRef(null);
  const heroImgRef      = useRef(null);
  const heroGradientRef = useRef(null);
  const breadcrumbRef   = useRef(null);
  const heroTitleRef    = useRef(null);
  const heroCtaRef      = useRef(null);
  const statsCardRef    = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        /* image zooms in */
        .fromTo(
          heroImgRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 1.8 }
        )
        /* gradient fades in */
        .fromTo(
          heroGradientRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.1 },
          "-=1.5"
        )
        /* breadcrumb drops in */
        .fromTo(
          breadcrumbRef.current,
          { y: -16, opacity: 0 },
          { y: 0,   opacity: 1, duration: 0.6 },
          "-=0.9"
        )
        /* title rises */
        .fromTo(
          heroTitleRef.current,
          { y: 44, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.9 },
          "-=0.6"
        )
        /* CTA button */
        .fromTo(
          heroCtaRef.current,
          { y: 20, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.7 },
          "-=0.45"
        )
        /* floating stats card */
        .fromTo(
          statsCardRef.current,
          { y: 30, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.2"
        );
    }, heroWrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full" ref={heroWrapRef}>

      {/* ── Hero ── */}
      <div className="relative h-[480px] sm:h-[520px] lg:h-[600px] w-full overflow-hidden">
        <img
          ref={heroImgRef}
          src={aboutHeroImg}
          alt="Aqualife water purifiers and coolers"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={heroGradientRef}
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10"
        />

        {/* Breadcrumb */}
        <div
          ref={breadcrumbRef}
          className="absolute top-20 lg:top-30 left-0 w-full z-10"
        >
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="primary-container relative z-10 flex h-full flex-col justify-center pt-20 sm:pt-24">
          <h1
            ref={heroTitleRef}
            className="max-w-md heading sm:max-w-lg lg:max-w-xl text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-white"
          >
            Your family deserves better than tap water
          </h1>

          <div ref={heroCtaRef}>
            <Link
              to="/contact-us"
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-lg border border-white/70
                px-5 py-2.5 text-sm font-medium text-white transition-all duration-200
                hover:bg-white hover:text-slate-900 active:scale-95"
            >
              Book Demo
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Floating stats card ── */}
      <div className="primary-container relative z-20 mb-10 -mt-16 sm:-mt-14 lg:-mt-16">
        <div
          ref={statsCardRef}
          className="rounded-2xl m-auto max-w-[1110px] lg:max-h-[230px] bg-white shadow-xl px-6 py-8 sm:px-8 sm:py-9 lg:px-12 lg:py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
            {STATS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-blue-600">
                  <Icon size={40}  className="sm:hidden" />
                  <Icon size={48}  className="hidden sm:block lg:hidden" />
                  <Icon size={60}  className="hidden lg:block" />
                </span>
                <h3 className="heading text-base sm:text-lg font-semibold text-slate-900">{title}</h3>
                <p  className="text-xs sm:text-sm leading-relaxed text-blue-600/80 max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <AboutSection />
      </div>

      <VisionMission />
      <WhyChooseUs />
    </section>
  );
}