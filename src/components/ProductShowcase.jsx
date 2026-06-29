import { Play } from "lucide-react";

import bannerLeft from "../assets/color_bg_1.jpg";
import bannerRight from "../assets/color_bg_2.png";
import BottomBanner from "../assets/banner_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";

export default function ProductShowcase() {
  return (
    <section className="w-full">

      {/* ───────── TOP ROW ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2">

        {/* Card 1 */}
        <div className="relative flex flex-col items-center justify-between text-center overflow-hidden min-h-[380px] sm:min-h-[450px] lg:min-h-[520px] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-16">

          {/* Background */}
          <div
            className="absolute inset-0"
            style={{ background: "#00EEFF" }}
          />

          <img
            src={bannerLeft}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-multiply opacity-60"
          />

          {/* Heading */}
          <h2
            className="relative z-10 heading font-extrabold text-slate-900
            max-w-[320px] leading-[1.2]
            text-[clamp(1.25rem,2vw+0.6rem,1.9rem)]"
          >
            Next-Gen UV Water Purification
          </h2>

          {/* Product */}
          <img
            src={product3}
            alt="Aqua Life Lego purifier"
            className="relative z-10 w-[140px] sm:w-[180px] md:w-[210px] lg:w-[240px] object-contain drop-shadow-xl my-5"
          />

          {/* Bottom */}
          <div className="relative z-10">
            <h3
              className="heading font-semibold text-slate-900 leading-tight
              text-[clamp(1.8rem,3vw+0.5rem,2.8rem)]"
            >
              Aqua Life Lego
            </h3>

            <p
              className="font-semibold text-slate-900 mt-2 mb-5
              text-[clamp(1rem,1vw+0.8rem,1.3rem)]"
            >
              Starting at ₹18,490.00*
            </p>

            <button
              className="bg-slate-900 text-white font-semibold rounded-full
              px-5 py-2.5 sm:px-6 lg:px-7
              text-[clamp(0.875rem,0.5vw+0.75rem,1rem)]
              transition-all duration-200 active:scale-95 hover:bg-slate-800 cursor-pointer"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative flex flex-col items-center justify-between text-center overflow-hidden min-h-[380px] sm:min-h-[450px] lg:min-h-[520px] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-16">

          {/* Background */}
          <img
            src={bannerRight}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Heading */}
          <h2
            className="relative z-10 heading font-bold text-white
            max-w-[340px] leading-[1.2]
            text-[clamp(1.25rem,2vw+0.6rem,1.9rem)]"
          >
            Goodness of Copper in every drop
          </h2>

          {/* Product */}
          <img
            src={product4}
            alt="Elite+ purifier"
            className="relative z-10 w-[130px] sm:w-[170px] md:w-[200px] lg:w-[225px] object-contain drop-shadow-xl my-5"
          />

          {/* Bottom */}
          <div className="relative z-10">
            <h3
              className="heading font-semibold text-white leading-tight
              text-[clamp(1.8rem,3vw+0.5rem,2.8rem)]"
            >
              Elite+
            </h3>

            <p
              className="font-semibold text-white mt-2 mb-5
              text-[clamp(1rem,1vw+0.8rem,1.3rem)]"
            >
              Starting at ₹16,499*
            </p>

            <button
              className="bg-slate-900 text-white font-semibold rounded-full
              px-5 py-2.5 sm:px-6 lg:px-7
              text-[clamp(0.875rem,0.5vw+0.75rem,1rem)]
              transition-all duration-200 active:scale-95 hover:bg-slate-800 cursor-pointer"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Bottom Banner ───────── */}
      <div className="relative w-full">

        <img
          src={BottomBanner}
          alt="Pure Water Pure Life — Aqualife"
          className="w-full h-auto object-cover block"
        />

        <button
          className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
          rounded-full border-2 border-white/85 backdrop-blur-sm
          flex items-center justify-center
          hover:bg-blue-600 hover:border-blue-600 hover:scale-110
          active:scale-95 transition-all duration-300 cursor-pointer
          before:absolute before:inset-[-6px] before:rounded-full
          before:border-2 before:border-white/35
          before:animate-[pulse-ring_2s_ease-out_infinite]
          after:absolute after:inset-[-6px] after:rounded-full
          after:border-2 after:border-white/20
          after:[animation:pulse-ring_2s_ease-out_0.6s_infinite]"
          aria-label="Play video"
        >
          <Play
            size={22}
            fill="white"
            className="text-white ml-0.5 transition-transform duration-300 group-hover:scale-110"
          />
        </button>

      </div>
    </section>
  );
}