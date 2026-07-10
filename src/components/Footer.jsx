// Footer.jsx
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,

} from "react-icons/fa";
import { Link } from "react-router-dom";
import footerLogo from "../assets/White_Logo.png";
import visaIcon    from "../assets/payment_visa.png";
import mcIcon      from "../assets/payment_mastercard.png";
import rupayIcon   from "../assets/payment_rupay.png";
import upiIcon     from "../assets/payment_upi.png";
import emiIcon     from "../assets/payment_emi.png";

const COMPANY_LINKS = [
  { label: "About",           to: "/about-us" },
  { label: "Careers",         to: "/careers" },
  { label: "Water Cooler",    to: "/water-cooler" },
  { label: "Water Softeners", to: "/water-softeners" },
  { label: "RO Plant",        to: "/ro-plant" },
  { label: "Water Purifiers", to: "/water-purifiers" },
];

const PRODUCT_LINKS = [
  { label: "Venus-UV",              to: "/products/venus-uv" },
  { label: "Lego-UV",               to: "/products/lego-uv" },
  { label: "Lego plus UV+RO",       to: "/products/lego-plus" },
  { label: "Elite Plus UV+RO",      to: "/products/elite-plus" },
  { label: "Ocean UTC",             to: "/products/ocean-utc" },
  { label: "Ocean Plus UV+UTC RO",  to: "/products/ocean-plus" },
];

const LEGAL_LINKS = [
  { label: "Terms",    to: "/terms" },
  { label: "Privacy",  to: "/privacy" },
  { label: "Cookies",  to: "/cookies" },
  { label: "Licenses", to: "/licenses" },
  { label: "Settings", to: "/settings" },
  { label: "Contact",  to: "/contact-us" },
];

const SOCIAL = [
  { icon: FaYoutube,   label: "YouTube",   href: "https://youtube.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaFacebookF,  label: "Facebook",  href: "https://facebook.com" },
  { icon: FaTwitter,   label: "Twitter",   href: "https://twitter.com" },
];

const PAYMENT_ICONS = [
  { src: visaIcon,  alt: "Visa" },
  { src: mcIcon,    alt: "Mastercard" },
  { src: rupayIcon, alt: "RuPay" },
  { src: upiIcon,   alt: "UPI" },
  { src: emiIcon,   alt: "EMI" },
];

function FooterCol({ heading, links, width }) {
  return (
    <div>
      <p className="text-white font-semibold text-[14px] mb-4">{heading}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-slate-400 text-[13px] hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#040C2B]">

      {/* ── Main footer body ── */}
      <div className="primary-container py-12 sm:py-14 lg:py-16 heading">
        <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-[1.2fr_1fr_1.3fr_1fr_1.5fr]
    gap-15
    lg:gap-8
  "
>

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="block w-35  mb-4">
              <img src={footerLogo} 
              loading="lazy"
              alt="Aqualife" className="w-full h-full object-contain" />
            </Link>

            <p className="text-slate-400 text-[13px] leading-relaxed">
              We, at Aqcacool Co. PVT .LTD Believe That We Only Succeed by Serving our customer and Fulfilling their needs upto their Satisfaction
            </p>
          </div>

          {/* Col 2 — Company */}
          <FooterCol heading="Company" links={COMPANY_LINKS} />

          {/* Col 3 — Product */}
          <FooterCol heading="Product" links={PRODUCT_LINKS} />

          {/* Col 4 — Legal */}
          <FooterCol heading="Legal" links={LEGAL_LINKS} />

          {/* Col 5 — Partner + Payment */}
          <div className="lg:col-span-1">
            <p className="text-white text-[13px] heading leading-snug mb-4">
              Join us as a trade partner in the growing water purification market in India.
            </p>
            <button className="w-full cursor-pointer sm:w-auto bg-white text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all mb-6">
              Become Partner
            </button>

            <p className="text-white font-semibold text-[14px] mb-3">Payment Method</p>
            <div className="flex items-center gap-2 flex-wrap">
              {PAYMENT_ICONS.map((p) => (
                <div
                  key={p.alt}
                  className="bg-white rounded px-1.5 py-1 flex items-center justify-center h-7"
                >
                  <img loading="lazy" src={p.src} alt={p.alt} className="h-4 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10" />

      {/* ── Bottom bar ── */}
      <div className="primary-container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-[13px]">
          Copyright © 2026 . All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-[13px]">Follow Us</span>
          {SOCIAL.map(({ icon: Icon, label, href }) => (
            
            <a  key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}