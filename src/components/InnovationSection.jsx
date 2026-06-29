import { Droplets, Wrench, HeadphonesIcon } from "lucide-react";
import WaveAnimation from "./WaveAnimation";
import waveImg from "../assets/water_waves.png"// replace with your actual wave image

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
  return (
    <section className="bg-[#F6FAFF]">

      {/* ── Wave banner ── */}
      <WaveAnimation
        imageUrl={waveImg}
        height="clamp(160px, 22vw, 275px)"
        amplitude={0.14}
        frequency={1.3}
        speed={0.9}
        mouseTilt={true}
        fullBleed={true}
      />

      {/* ── Content ── */}
      <div className="primary-container  text-center ">

        {/* Heading */}
        <h2 className="text-2xl heading sm:text-3xl lg:text-[2.4rem] font-semibold sm:mb-16 relative bottom-15">
          Innovation That Keeps Your
          <br />
          Water Pure
        </h2>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 lg:gap-10 sm:mb-16 relative bottom-15">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center px-2 sm:px-4">

              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-5">
                <Icon
                  size={48}
                  strokeWidth={1.2}
                  className="text-blue-500"
                />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 heading ">
                {title}
              </h3>
              <p className="text-[#3D5B79] text-sm sm:text-[14.5px] lg:text-[16px] leading-relaxed max-w-[401px]">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-sm sm:text-[15px] relative bottom-10 lg:bottom-15 ">
          The machine and servicing are both managed and provided by Aqualife Ever.
        </p>

      </div>
    </section>
  );
}