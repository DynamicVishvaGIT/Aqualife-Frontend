// Replace these with your actual image imports
import cert1 from "../assets/certificate.jpg";
import cert2 from "../assets/certificate.jpg";
import cert3 from "../assets/certificate.jpg";

import badgeNSF        from "../assets/trusted_1.png";
import badgeMakeInIndia from "../assets/trusted_2.png";
import badgeISO        from "../assets/trusted_3.png";
import badgeISI        from "../assets/trusted_4.png";
// import badgeTrusted    from "../assets/badge_trusted.png";

const CERTIFICATES = [
  {
    id: 1,
    image: cert1,
    label: "Certificate by:  ISO 9001:2015",
    title: "Quality Management System",
  },
  {
    id: 2,
    image: cert2,
    label: "Certificate by:  ISO 14001:2015",
    title: "Environmental Management System",
  },
  {
    id: 3,
    image: cert3,
    label: "Certificate by:  ISO/TC 260",
    title: "Registered Site",
  },
];

const BADGES = [
  { id: 1, image: badgeNSF,         alt: "NSF Independently Certified" },
  { id: 2, image: badgeMakeInIndia, alt: "Make In India" },
  { id: 3, image: badgeISO,         alt: "ISO Certified" },
  { id: 4, image: badgeISI,         alt: "ISI Mark" },
//   { id: 5, image: badgeTrusted,     alt: "Trusted & Certified" },
];

export default function LegacySection() {
  return (
    <section className="bg-[#FFF9F9] py-10 sm:py-12 lg:py-14">

      <div className="primary-container">

        {/* ── Heading ── */}
        <h2 className="text-xl heading sm:text-2xl font-bold text-slate-900 mb-2">
          A Legacy of Excellence
        </h2>
        <p className="text-sm sm:text-[15px] leading-relaxed max-w-3xl mb-10 sm:mb-12">
          Celebrating 25 years of trust, innovation, and customer satisfaction as one
          of India's most preferred RO and home appliance brands.
        </p>

        {/* ── Certificates row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-14">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center gap-4 h-[160px] bg-[#FFFFFF] rounded-xl px-4 py-4 shadow-sm border border-slate-100"
            >
              {/* Certificate thumbnail */}
              <div className="shrink-0 w-16 h-25 sm:w-20 sm:h-30 overflow-hidden rounded-md border border-slate-200">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div>
                <p className="text-slate-400 text-[12px] sm:text-[13px] mb-0.5">
                  {cert.label}
                </p>
                <p className="text-slate-900 text-[13px] sm:text-sm font-bold leading-snug">
                  {cert.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Badge logos row ── */}
        <div className="flex flex-wrap items-center justify-center  gap-6 sm:gap-10">
          {BADGES.map((badge) => (
            <div key={badge.id} className="flex items-center justify-center">
              <img
                src={badge.image}
                alt={badge.alt}
                className="h-14 sm:h-16 lg:h-20 w-auto object-contain grayscale-0"
                draggable={false}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}