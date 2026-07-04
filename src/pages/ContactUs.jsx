// components/ContactUs.jsx
import { MapPin, Phone, Mail } from "lucide-react";
  // components/LocationMap.jsx
import { useEffect, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"


import contactHeroImg from "../assets/about_banner_1.png"; 
import Breadcrumb from "../components/Breadcrumb";

const OFFICES = [
  {
    title: "Head Office",
    address:
      "Row House, A-99, Opp. Shri Ram School, Sector-4, Airoli- 400708. India.",
  },
  {
    title: "Sales Office",
    address:
      "Unit No. 501, Elecon Arcade Premises Co. Op. Society Ltd, Next To Marol Metro Station, Andheri-Kurla Road, Andheri (E), Mumbai 400059. India.",
  },
  {
    title: "Workshop",
    address:
      "Sai Sadan Row House No.04, Sector 2E of Opp. Modi Hospital, Airoli, Navi Mumbai 400708. India.",
  },
];

const SOCIALS = [
  { icon: FaXTwitter, label: "Twitter" },
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaLinkedinIn, label: "LinkedIn" },
  { icon: FaWhatsapp, label: "WhatsApp" },
];

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // wire this up to your API / form handler
    console.log(form);
  };



// Swap in your actual coordinates / embed src.
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.9!2d-118.2851!3d34.0224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUniversity+of+Southern+California!5e0!3m2!1sen!2sus!4v0";


function LocationMap() {
  return (
    <section className="w-full">
        <div
          className={`relative w-full h-[260px] sm:h-[340px] lg:h-[420px] overflow-hidden shadow-lg
            transition-all duration-700 ease-out`}
        >
          {/* Live, interactive Google Map */}
          <iframe
            title="Our location on Google Maps"
            src={MAP_EMBED_SRC}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>
    </section>
  );
}

  return (
    <section className="w-full mt-20">
      {/* ── Hero ── */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <img
          src={contactHeroImg}
          alt="Aqualife products"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

            {/* Breadcrumb */}
        <div className="absolute top-2 lg:top-14 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>


        <div className="relative z-10 h-full primary-container flex items-center justify-center">
          <h1 className="heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      {/* ── Contact & Join Together ── */}
      <div className="w-full bg-[#F9F9F9] py-5 sm:py-8 lg:py-12">
        <div className="primary-container">
          <h2 className="heading text-center text-2xl sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-10">
            Contact &amp; Join Together
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {OFFICES.map(({ title, address }) => (
              <div
                key={title}
                className="rounded-xl bg-white shadow-sm px-5 py-6 sm:px-6 sm:py-4 flex flex-col items-center gap-3"
              >
                <h3 className="font-semibold heading text-slate-900 text-base sm:text-xl">
                  {title}
                </h3>
                <p className="flex items-start gap-2 text-xs sm:text-[14px] text-slate-500 leading-relaxed">
                  <MapPin size={20} className="shrink-0 mt-0.5" />
                  <span className="text-start">{address}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Send Us Messages ── */}
      <div className="w-full bg-white py-12 sm:py-14 lg:py-6">
        <div className="primary-container">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Send Us Messages
          </h2>
          <p className="text-sm text-slate-500 mb-8 sm:mb-10 max-w-xl">
            Do you have a question ? A complaint ? Or need any help to choose the right from
            Aqualife every feel free to contact us.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]  gap-6 lg:gap-15">
            {/* ── Form ── */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Contact No</label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={form.contactNo}
                    onChange={handleChange}
                    placeholder="Enter Your Contact Number"
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter Your Message"
                  rows={5}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-center sm:justify-start mt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-full bg-[#0061C2] px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 active:scale-95"
                >
                  Send a Message
                </button>
              </div>
            </div>

            {/* ── Info card ── */}
            <div className="relative lg:bottom-12 rounded-2xl bg-[#0061C2] text-white p-6 sm:p-7 flex flex-col gap-5 h-fit">
              <p className="text-sm sm:text-base leading-relaxed">
                Hi! We are always here to help you .
              </p>

              <div className="rounded-xl bg-white text-slate-900 px-4 py-3.5 flex items-start gap-3">
                <span className="mt-0.5 text-[#0061C2]">
                  <Phone size={24} />
                </span>
                <div className="text-sm text-[#0061C2]">
                  <p className="font-semibold">Contact No</p>
                  <p className="">+91 9152121121 / 022 47487556</p>
                </div>
              </div>

              <div className="rounded-xl bg-white text-slate-900 px-4 py-3.5 flex items-start gap-3">
                <span className="mt-0.5 text-[#0061C2]">
                  <Mail size={24} />
                </span>
                <div className="text-sm text-[#0061C2]">
                  <p className="font-semibold">Email</p>
                  <p className="break-all">
                    custmersupport@aquacoolgroup
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/25">
                <p className="text-sm mb-3">Connect With Us :</p>
                <div className="flex items-center gap-3">
                  {SOCIALS.map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors duration-200"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <LocationMap/>
    </section>
  );
}