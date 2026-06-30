// CommunitySection.jsx
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";

import user1 from "../assets/user_1.png";
import user2 from "../assets/user_2.png";

const TESTIMONIALS = [
{
  id: 1,
  image: user1,
  text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
  name: "Priya Sharma",
  location: "Mumbai",
},
{
  id: 2,
  image: user2,
  text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
  name: "Karthik Reddy",
  location: "Mumbai",
},
{
  id: 3,
  image: user1,
  text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
  name: "Anita Patel",
  location: "Delhi",
},
];

export function CommunitySection() {
  const swiperRef = useRef(null);
  const [lastDir, setLastDir] = useState(null);

  const handlePrev = () => { swiperRef.current?.slidePrev(); setLastDir("prev"); };
  const handleNext = () => { swiperRef.current?.slideNext(); setLastDir("next"); };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-10">
      <div className="primary-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── Left: heading + copy + CTA ── */}
          <div className="lg:col-span-5 ">
            <h2 className="text-2xl heading sm:text-3xl lg:text-[2rem] font-semibold text-slate-900 leading-tight mb-4">
              A Thriving Community Of<br />Over 1 Million
            </h2>
            <p className="text-slate-900 text-lg sm:text-[15px] leading-relaxed mb-4">
              1 in 3 new Aqualife users find us through a friend or family referral.
            </p>
            <p className="text-slate-900 text-lg sm:text-[15px] leading-relaxed mb-8">
              Our happy customers understand the impact of pure drinking water on the health and wellness of the entire community.
            </p>
            <button className="bg-slate-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-slate-700 active:scale-95 transition-all">
              View All
            </button>
          </div>

          {/* ── Right: testimonial slider ── */}
          <div className="relative lg:col-span-7">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop
              speed={600}
              onSwiper={(s) => (swiperRef.current = s)}
              slidesPerView={1}
              spaceBetween={16}
              breakpoints={{
                580: { slidesPerView: 2, spaceBetween: 16 },
              }}
            >
              {TESTIMONIALS.map((t) => (
                <SwiperSlide key={t.id}>
                  <div className="bg-[#F3F8FF] rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Photo */}
                    <div className="w-full h-44 sm:h-52 overflow-hidden">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed mb-4 flex-1">
                        {t.text}
                      </p>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">{t.name}</p>
                        <p className="text-slate-400 text-[12px]">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Prev arrow — left of slider */}
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className={`absolute cursor-pointer -left-5 top-[42%] -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
                lastDir === "prev"
                  ? "bg-[#0061C2] text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <ArrowLeft size={18} />
            </button>

            {/* Next arrow — right of slider */}
            <button
              aria-label="Next"
              onClick={handleNext}
              className={`absolute cursor-pointer -right-5 top-[42%] -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
                lastDir !== "prev"
                  ? "bg-[#0061C2] text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}