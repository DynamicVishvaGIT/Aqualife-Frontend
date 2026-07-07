import React from "react";
import banner2 from "../assets/new aqua.jpg";

const AlkalineWaterBanner = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "1440 / 589" }}
    >
      {/* Background Image */}
      <img
        src={banner2}
        loading="lazy"
        alt="Aqualife Elite RO+UV Water Purifier"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full flex items-center px-5 sm:px-8 lg:px-20">
          {/* Content
              maxWidth uses clamp() instead of a fixed lg:max-w-[1000px]/lg:h-[600px].
              The forced 600px height was taller than the banner itself at typical
              lg widths (banner height = viewport width / 2.44), which is what was
              actually breaking centering on laptop screens. Letting flex+content
              decide height fixes that. */}
          <div
            className="w-full flex flex-col justify-center"
            style={{ maxWidth: "clamp(320px, 42vw, 900px)" }}
          >
            {/* Heading
                clamp() replaces text-[15px] sm:28 md:34 lg:20(bug) xl:80.
                The lg value regressed below md — clamp removes that cliff
                entirely and scales smoothly from 15px (mobile) to 80px (desktop). */}
            <h2
              className="heading text-white font-semibold leading-tight
                  text-[17px]
              sm:text-[28px]
              md:text-[34px]
              lg:text-[45px]
              2xl:text-[80px]
              "
            >
              Increases pH to get
              <br />
              Alkaline Water
            </h2>

            {/* Space — was h-4 lg:h-30 (h-30 isn't a valid Tailwind size, so this
                never grew past 16px on lg/xl). Now scales fluidly instead. */}
            <div style={{ height: "clamp(0.75rem, 4vw, 4rem)" }} />

            {/* Product Name */}
            {/* Product Name */}
            <h3
              className="heading text-white font-semibold leading-tight
                 text-[10px]
              sm:text-[28px]
              md:text-[34px]
              lg:text-[28px]
              2xl:text-[50px]"
             
            >
              Aqualife Elite RO+UV Water Purifier
            </h3>

            {/* Price */}
            <p
              className="heading text-white font-semibold
                  text-[1px]
              sm:text-[28px]
              md:text-[34px]
              lg:text-[28px]
              2xl:text-[40px]
              "
            >
              Starting at ₹14,999*
            </p>

            {/* Offer */}
            <p
              className="text-white/90 leading-relaxed"
              style={{
                fontSize: "clamp(0.5rem, calc(1.6vw + 0.1rem), 1.1rem)",
                marginTop: "clamp(0.4rem, 0.8vw, 1rem)",
              }}
            >
              10% Instant Bank Discount + Exchange Offer +
              <br />
              Exclusive Coupon*
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlkalineWaterBanner;
